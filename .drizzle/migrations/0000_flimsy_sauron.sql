CREATE TABLE IF NOT EXISTS "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"discord_id" text NOT NULL,
	"discord_avatar" text NOT NULL,
	"anilist_token" text,
	"anilist_username" text,
	"anilist_id" integer,
	CONSTRAINT "user_username_unique" UNIQUE("username"),
	CONSTRAINT "user_discord_id_unique" UNIQUE("discord_id"),
	CONSTRAINT "user_anilist_id_unique" UNIQUE("anilist_id")
);
