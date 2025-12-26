export default defineEventHandler(async (event) => {
	const sessionUser = event.context.user;
	if (!sessionUser) return null;

	// If the user does exist in event.context, then we make sure to return the full user from database
	// in case it's empty.
	const dbUser = await db.query.user.findFirst({
		where: (user, { eq }) => eq(user.id, sessionUser.id)
	});

	return dbUser;
});
