import { rsaEncryption } from "~/composables/rsaEncrypt";
import { generateId } from "lucia";
import { eq } from "drizzle-orm";

export default eventHandler(async (event) => {
  const user = event.context.user;
  const query = getQuery(event);
  const code = query.code?.toString() ?? null;
  const state = query.state?.toString() ?? null;
  const storedState = getCookie(event, "anilist_oauth_state") ?? null;

  if (!code || !state || !storedState || state !== storedState || !user) {
    throw createError({
      statusCode: 400,
      statusMessage: "Internal server error"
    });
  }

  try {
    const token = await anilist.validateAuthorizationCode(code)
    const anilistRes = await $fetch<{
      data: {
        "Viewer": {
          name: string,
          id: number
        }
      }
    }>("https://graphql.anilist.co", {
      method: "post",
      headers: {
        "Authorization": `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        query: `
          query {
            Viewer {
              name
              id
            }
          }
        `
      })
    })
    if (!anilistRes.data) throw new Error("No anilist data found")

    const { Viewer: { name, id } } = anilistRes.data;

    console.time("Encrypt Token")
    const encryptedToken = await rsaEncryption(token.accessToken);
    console.timeEnd("Encrypt Token")

    const existingUser = event.context?.user || await db.query.user.findFirst({
      where: (user, { eq }) => eq(user.anilistId, id)
    })
    if (existingUser) {
      await db.update(userTable)
        .set({ anilistId: id, anilistToken: encryptedToken, anilistUsername: name })
        .where(eq(userTable.id, user.id))
      if (!event.context.user) {
        const session = await lucia.createSession(existingUser.id, {})
        appendHeader(event, "Set-Cookie", lucia.createSessionCookie(session.id).serialize())
      }
    } else {
      const userId = generateId(15);
      await db.insert(userTable).values({
        id: userId,
        anilistId: id,
        anilistToken: encryptedToken,
        anilistUsername: name
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
