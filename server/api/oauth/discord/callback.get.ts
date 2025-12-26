import { OAuth2RequestError } from "arctic";
import { eq } from "drizzle-orm";
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
		const tokens = await discord.validateAuthorizationCode(code, null)
		const discordRes = await $fetch<DiscordResponse>("https://discord.com/api/users/@me", {
			headers: {
				Authorization: `Bearer ${tokens.accessToken()}`
			}
		});

		// If the Discord ID is not found in database,
		// assume it to belong to the current user to avoid duplicates.
		const existingUser = await db.query.user?.findFirst({
			where: (user, { eq }) => eq(user.discordId, discordRes.id)
		});

		if (existingUser) {
			await db.update(userTable).set({
				discordId: discordRes.id,
				discordAvatar: discordRes.avatar,
				username: discordRes.username,
			}).where(eq(userTable.id, existingUser.id!));

			const session = await lucia.createSession(existingUser.id, {})
			appendHeader(event, "Set-Cookie", lucia.createSessionCookie(session.id).serialize())

		} else {
			const userId = generateId(15);
			await db.insert(userTable).values({
				id: userId,
				discordId: discordRes.id,
				discordAvatar: discordRes.avatar,
				username: discordRes.username,
			})

			const session = await lucia.createSession(userId, {})
			appendHeader(event, "Set-Cookie", lucia.createSessionCookie(session.id).serialize())
		}

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
