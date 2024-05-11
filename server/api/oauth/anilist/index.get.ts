import { generateState } from "arctic"

export default eventHandler(async (event) => {
  const state = generateState()
  const user = event.context.user

  const url = await anilist.createAuthorizationURL(state)

  setCookie(event, "anilist_oauth_state", state, {
    path: "/",
    secure: !process.dev,
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax"
  });

  return sendRedirect(event, url.toString())
})
