import type { AniListQueryResponse } from "~/server/utils/types";
import { rsaEncryption } from "~/composables/rsaEncrypt";
import { generateId } from "lucia";
import { and, eq, ne } from "drizzle-orm";

export default eventHandler(async (event) => {
  const query = getQuery(event);

  const code = query.code?.toString();
  const state = query.state?.toString();
  const storedState = getCookie(event, "anilist_oauth_state");

  if (!code || !state || !storedState || state !== storedState) {
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error"
    });
  }

  try {
    const tokens = await anilist.validateAuthorizationCode(code)
    const accessToken = tokens.accessToken()
    const query = `query { Viewer { name id } }`;

    const anilistRes = await $fetch<AniListQueryResponse>("https://graphql.anilist.co", {
      method: "post",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ query })
    })

    if (!anilistRes.data) throw new Error("No anilist data found")

    const { Viewer: viewer } = anilistRes.data;

    const encryptedToken = await rsaEncryption(accessToken);

    // If the AniList viewer ID is not found in database,
    // assume it to belong to the current user to avoid duplicates.
    const providerUser = await db.query.user?.findFirst({
      where: (user, { eq }) => eq(user.anilistId, viewer.id)
    });

    if (event.context.user) {
      // As we want there to be only one user with the AniList ID connected at a time,
      // unset it from any rows  that have the current AniList ID.
      await db.update(userTable)
        .set({
          anilistId: null,
          anilistToken: null,
          anilistUsername: null
        })
        .where(
          and(
            eq(userTable.anilistId, viewer.id),
            ne(userTable.id, event.context.user.id)
          )
        );

      await db.update(userTable)
        .set({
          anilistId: viewer.id, anilistToken: encryptedToken, anilistUsername: viewer.name,
        })
        .where(eq(userTable.id, event.context.user.id!))
    } else {
      const userId = providerUser?.id ?? generateId(15);

      if (!providerUser) {
        await db.insert(userTable).values({
          id: userId,
          anilistId: viewer.id,
          anilistToken: encryptedToken,
          anilistUsername: viewer.name
        })
      }

      const session = await lucia.createSession(userId, {})
      appendHeader(event, "Set-Cookie", lucia.createSessionCookie(session.id).serialize())
    }

    return await sendRedirect(event, '/')
  } catch (e) {
    console.error(e)
    return createError({
      statusCode: 400,
    })
  }
})
