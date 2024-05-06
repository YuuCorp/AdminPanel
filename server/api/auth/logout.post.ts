import { eq } from "drizzle-orm";

export default eventHandler(async (event) => {
	try {
		if (!event.context.session || !event.context.user) {
			throw createError({
				statusCode: 403,
				message: "You are not logged in",
			});
		}

		// Remove the user from database
		const user = event.context.user;
		await db.delete(userTable).where(eq(userTable.id, user.id));

		await lucia.invalidateSession(event.context.session.id);
		appendHeader(event, "Set-Cookie", lucia.createBlankSessionCookie().serialize());
	} catch (e) {
		console.error(e);
	};
});
