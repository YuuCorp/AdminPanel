import { eq } from "drizzle-orm";

export default eventHandler(async (event) => {
	try {
		if (!event.context.session || !event.context.user) {
			throw createError({
				statusCode: 403,
				message: "You are not logged in",
			});
		}

		// Add an artificial delay of 1s
		await new Promise(r => setTimeout(r, 1000));

		// Remove the user from database
		const user = event.context.user;
		await db.delete(userTable).where(eq(userTable.id, user.id));

		// Invalidate their Lucia session
		await lucia.invalidateSession(event.context.session.id);
		appendHeader(event, "Set-Cookie", lucia.createBlankSessionCookie().serialize());

		return { message: "*psst* You were never here" };
	} catch (e) {
		console.error(e);
	};
});
