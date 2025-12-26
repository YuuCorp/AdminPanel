import type { AniListQueryResponse } from "~/server/utils/types";
import { rsaEncryption } from "~/composables/rsaEncrypt";
import { generateId } from "lucia";
import { eq } from "drizzle-orm";

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
    const existingUser = await db.query.user.findFirst({
      where: (user, { eq }) => eq(user.anilistId, viewer.id)
    }) || event.context.user;

    if (existingUser) {
      await db.update(userTable)
        .set({
          anilistId: viewer.id, anilistToken: encryptedToken, anilistUsername: viewer.name,
        })
        .where(eq(userTable.id, existingUser.id!))

      const session = await lucia.createSession(existingUser.id, {})
      appendHeader(event, "Set-Cookie", lucia.createSessionCookie(session.id).serialize())

    } else {
      const userId = generateId(15);
      await db.insert(userTable).values({
        id: userId,
        anilistId: viewer.id,
        anilistToken: encryptedToken,
        anilistUsername: viewer.name
      })

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
