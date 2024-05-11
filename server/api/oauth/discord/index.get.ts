import { generateState } from "arctic";

export default eventHandler(async (event) => {
	try {
		// return await db.delete(userTable);
		const state = generateState();
		const url = await discord.createAuthorizationURL(state, {
			scopes: ["identify"]
		});

		setCookie(event, "discord_oauth_state", state, {
			path: "/",
			secure: !process.dev,
			httpOnly: true,
			maxAge: 60 * 10,
			sameSite: "lax"
		});

		return sendRedirect(event, url.toString());
	} catch (error) {
		console.error(error);
		throw createError({
			statusCode: 500,
			statusMessage: "Failed to create Discord authorization URL."
		});
	}
})
