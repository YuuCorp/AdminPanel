import { generateState } from "arctic";

export default eventHandler(async (event) => {
  console.log("hui")
	const state = generateState();
	const url = await discord.createAuthorizationURL(state, {
    scopes: ["identify"]
  });

  console.log(url.toString())

	setCookie(event, "discord_oauth_state", state, {
		path: "/",
		secure: !process.dev,
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: "lax"
	});
	return sendRedirect(event, url.toString());
})
