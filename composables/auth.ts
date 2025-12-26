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