export default defineEventHandler((event) => {
	const user = event.context.user;

	if (!user?.discordId) {
		return { isAdmin: false };
	}

	const config = useRuntimeConfig();
	const trustedUsers = (config.private.protectedUsers)
		.split(",")
		.map(u => u.trim())
		.filter(Boolean);

	return {
		isAdmin: trustedUsers.includes(user.discordId)
	};
});
