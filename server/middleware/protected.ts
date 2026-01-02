export default defineEventHandler((event) => {
	if (!event.path.startsWith("/panel")) return;

	const user = event.context.user;

	if (!user) return navigateTo("/");

	// If the user is unauthenticated or not logged in, lead them back to home page
	// as you need to be logged in & authenticated to access this page.
	const config = useRuntimeConfig();
	const trustedUsers = (config.private.protectedUsers)
		.split(",")
		.map(u => u.trim())
		.filter(Boolean);

	const discordId = user.discordId;
	if (!discordId || !trustedUsers.includes(discordId)) {
		throw createError({
			statusCode: 403,
			statusMessage: "You are not authorized to view this page",
		});
	}
});
