import { Discord } from "arctic";
import { Lucia } from "lucia";

const { discord: discordCfg } = useRuntimeConfig()

interface DatabaseUserAttributes {
	username: string;
	discordId: string;
}

export const lucia = new Lucia(luciaDbAdapter, {
	sessionCookie: {
		attributes: { secure: !process.dev },
	},
	getUserAttributes: (attr) => ({
		username: attr.username,
		discordId: attr.discordId
	})
});

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

export const discord = new Discord(discordCfg.clientId, discordCfg.clientSecret, discordCfg.redirectUri)
