import { AniList, Discord } from "arctic";
import { Lucia } from "lucia";


const { discord: discordCfg, anilist: anilistCfg } = useRuntimeConfig()

interface DatabaseUserAttributes {
	username: string;
	discordId: string;
	discordAvatar: string;
	anilistId?: number;
	anilistToken?: string;
}

export const lucia = new Lucia(luciaDbAdapter, {
	sessionCookie: {
		attributes: { secure: !process.dev },
	},
	getUserAttributes: (attr) => ({
		username: attr.username,
		discordId: attr.discordId,
		discordAvatar: attr.discordAvatar,
		
		anilistId: attr.anilistId,
		anilistToken: attr.anilistToken
	})
});

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

export const discord = new Discord(discordCfg.clientId, discordCfg.clientSecret, discordCfg.redirectUri)
export const anilist = new AniList(anilistCfg.clientId, anilistCfg.clientSecret, anilistCfg.redirectUri)
