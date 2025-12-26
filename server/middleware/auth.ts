import { verifyRequestOrigin } from "lucia";

import type { User, Session } from "lucia";

export default defineEventHandler(async (event) => {
	// Make sure the header origin of the request matches the host header.
	if (event.node.req.method !== "GET") {
		const originHeader = getHeader(event, "Origin") ?? null;
		const hostHeader = getHeader(event, "Host") ?? null;
		if (!originHeader || !hostHeader || !verifyRequestOrigin(originHeader, [hostHeader])) {
			return event.node.res.writeHead(403).end();
		}
	}

	const sessionId = getCookie(event, lucia.sessionCookieName) ?? null;

	// Null the user's session if there does not exist a sessionId
	// `event.context` is arbitrary per-request data we attach to all erquests
	if (!sessionId) {
		event.context.session = null;
		event.context.user = null;
		return;
	}

	const { session, user } = await lucia.validateSession(sessionId);

	// If there exists a session & and it's fresh we create a valid session cookie, otherwise
	// just an empty one
	if (session && session.fresh) {
		appendHeader(event, "Set-Cookie", lucia.createSessionCookie(session.id).serialize());
	}

	if (!session) {
		appendHeader(event, "Set-Cookie", lucia.createBlankSessionCookie().serialize());
	}

	event.context.session = session;
	event.context.user = user;
});

declare module "h3" {
	interface H3EventContext {
		user: User | null;
		session: Session | null;
	}
}
