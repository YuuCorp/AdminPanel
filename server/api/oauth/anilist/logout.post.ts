import { eq } from "drizzle-orm";

export default eventHandler(async (event) => {
  if (!event.context.session) {
    throw createError({
      statusCode: 403
    });
  }

  const existingUser = event.context.user;
  if (!existingUser) {
    throw createError({
      statusCode: 400,
      statusMessage: "Tried to logout without being logged in."
    });
  }
  const dbUser = await db.query.user.findFirst({ where: (user, { eq }) => eq(user.id, existingUser.id) });
  if (!dbUser) {
    throw createError({
      statusCode: 400,
      statusMessage: "User not found in database."
    });
  }

  await db.update(userTable)
    .set({ anilistId: null, anilistToken: null, anilistUsername: null })
    .where(eq(userTable.id, existingUser.id));

  return await sendRedirect(event, '/')
});
