import { OAuth2RequestError } from "arctic";
import { generateId } from "lucia";

export default eventHandler(async (event) => {
	const query = getQuery(event);
	const code = query.code?.toString() ?? null;
	const state = query.state?.toString() ?? null;
	const storedState = getCookie(event, "discord_oauth_state") ?? null;

	if (!code || !state || !storedState || state !== storedState) {
		throw createError({
			statusCode: 400
		});
	}

	try {
		const tokens = await discord.validateAuthorizationCode(code)
		const discordRes = await $fetch<DiscordResponse>("https://discord.com/api/users/@me", {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		});

		const existingUser = await db.query.user.findFirst({ where: (user, { eq }) => eq(user.discordId, discordRes.id) })
		if (existingUser) {
			if (existingUser.username !== discordRes.username) await db.update(userTable).set({
				username: discordRes.username
			})

			const session = await lucia.createSession(existingUser.id, {})
			appendHeader(event, "Set-Cookie", lucia.createSessionCookie(session.id).serialize())
			return sendRedirect(event, "/")
		}

		const userId = generateId(15);
		await db.insert(userTable).values({
			id: userId,
			discordId: discordRes.id,
			username: discordRes.username
		})

		const session = await lucia.createSession(userId, {})
		appendHeader(event, "Set-Cookie", lucia.createSessionCookie(session.id).serialize())

		return sendRedirect(event, "/");
	} catch (e) {
		console.error(e)
		if (e instanceof OAuth2RequestError && e.message === "bad_verification_code") {
			throw createError({
				statusCode: 400
			});
		}
		throw createError({
			statusCode: 500
		});
	}

})
