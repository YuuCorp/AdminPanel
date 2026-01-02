import { OAuth2RequestError } from "arctic";
import { and, eq, ne } from "drizzle-orm";
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
		const providerUser = await db.query.user?.findFirst({
			where: (user, { eq }) => eq(user.discordId, discordRes.id)
		});

		if (event.context.user) {
			// As we want there to be only one user with the Discord ID connected at a time,
			// unset it from any rows  that have the current Discord ID.
			await db.update(userTable)
				.set({
					discordId: null,
					discordAvatar: null,
					username: null
				})
				.where(
					and(
						eq(userTable.discordId, discordRes.id),
						ne(userTable.id, event.context.user.id)
					)
				);

			await db.update(userTable)
				.set({
					discordId: discordRes.id, discordAvatar: discordRes.avatar, username: discordRes.username,
				})
				.where(eq(userTable.id, event.context.user.id!))
		} else {
			const userId = providerUser?.id ?? generateId(15);

			if (!providerUser) {
				await db.insert(userTable).values({
					id: userId,
					discordId: discordRes.id,
					discordAvatar: discordRes.avatar,
					username: discordRes.username,
				})
			}

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
