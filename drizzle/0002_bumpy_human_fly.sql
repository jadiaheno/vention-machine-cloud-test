ALTER TABLE "venti_album_user_ratings" ALTER COLUMN "rating" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "venti_albums" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "venti_albums" ALTER COLUMN "cover_url" SET NOT NULL;