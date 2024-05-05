import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";

export const userTable = pgTable('user', {
  id: text("id").primaryKey(),
  username: text("username").unique().notNull(),
  discordId: text("discord_id").unique().notNull(),
  discordAvatar: text("discord_avatar").notNull(),
  anilistToken: text("anilist_token"),
  anilistUsername: text("anilist_username"),
  anilistId: integer("anilist_id").unique(),
})

export const sessionTable = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull(),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const dbTables = {
  user: userTable,
  session: sessionTable,
};
