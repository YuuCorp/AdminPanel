export default defineEventHandler(async (event) => {
	const sessionUser = event.context.user;
	if (!sessionUser) return null;

	const dbUser = await db.query.user.findFirst({
		where: (user, { eq }) => eq(user.id, sessionUser.id)
	});

	return dbUser;
});
