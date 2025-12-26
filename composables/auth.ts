export type user = {
	username?: string;
	discordId?: string;
	discordAvatar?: string;
	anilistId?: number;
	anilistToken?: string;
	anilistUsername?: string;
}

export const useUser = () => {
	const user = useState<user | null>("user", () => null);
	return user;
};

export const useAuthenticatedUser = () => {
	const config = useRuntimeConfig();
	const trustedUsers = (config.private.protectedUsers)
		.split(",")
		.map(u => u.trim())
		.filter(Boolean);

	const user = useUser();
	return computed(() => {
		const userValue = unref(user);
		if (!userValue || !userValue.discordId) {
			throw createError("useAuthenticatedUser() can only be used in protected pages");
		}
		if (!trustedUsers.includes(userValue.discordId)) {
			throw createError({
				statusCode: 403,
				statusMessage: "You are not authorized to view this page",
			});
		}
		return userValue;
	});
};
