CREATE TABLE IF NOT EXISTS "venti_carts" (
	"user_id" varchar(255) NOT NULL,
	"album_id" uuid NOT NULL,
	"quantity" integer NOT NULL,
	CONSTRAINT "venti_carts_user_id_album_id_pk" PRIMARY KEY("user_id","album_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "venti_carts" ADD CONSTRAINT "venti_carts_user_id_venti_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "venti_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "venti_carts" ADD CONSTRAINT "venti_carts_album_id_venti_albums_album_id_fk" FOREIGN KEY ("album_id") REFERENCES "venti_albums"("album_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
