import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  pgView,
  primaryKey,
  serial,
  text,
  timestamp,
  uuid,
  varchar
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `venti_${name}`);

export const posts = createTable(
  "post",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    createdById: varchar("createdById", { length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
  },
  (example) => ({
    createdByIdIdx: index("createdById_idx").on(example.createdById),
    nameIndex: index("name_idx").on(example.name),
  })
);

export const users = createTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  ratings: many(albumUserRatings),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_userId_idx").on(account.userId),
  })
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_userId_idx").on(session.userId),
  })
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export const albums = createTable(
  "albums",
  {
    albumId: uuid("album_id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 256 }).notNull(),
    coverURL: varchar("cover_url", { length: 256 }).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at"),
  },
  (album) => ({
    nameIndex: index("album_idx").on(album.albumId),
  })
);

export const albumsRelations = relations(albums, ({ many }) => ({
  albumUserRatings: many(albumUserRatings),
}));

export const albumUserRatings = createTable(
  "album_user_ratings",
  {
    albumId: uuid("album_id").notNull().references(() => albums.albumId),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    rating: integer("rating").notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at"),
  },
  (albumRating) => ({
    pk: primaryKey({
      columns: [albumRating.albumId, albumRating.userId],
    }),
    nameIndex: index("ratings_idx").on(albumRating.albumId),
  })
);


export const albumUserRatingsRelations = relations(albumUserRatings, ({ one }) => ({
  album: one(albums, { fields: [albumUserRatings.albumId], references: [albums.albumId] }),
  user: one(users, { fields: [albumUserRatings.userId], references: [users.id] }),
}));

export const ratingsView = pgView("ratings", {
  albumId: uuid("album_id").primaryKey(),
  name: varchar("name", { length: 256 }),
  rating: integer("rating"),
})
  .as(sql`select album_id, name, avg(rating) as rating from ${albums} left join ${albumUserRatings} on albums.album_id = album_user_ratings.album_id group by album_id, name`)


export const carts = createTable(
  "carts",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    albumId: uuid("album_id").notNull().references(() => albums.albumId),
    quantity: integer("quantity").notNull(),
  },
  (cart) => ({
    pk: primaryKey({
      columns: [cart.userId, cart.albumId],
    }),
  })
);

export const cartsRelations = relations(carts, ({ one }) => ({
  album: one(albums, { fields: [carts.albumId], references: [albums.albumId] }),
  user: one(users, { fields: [carts.userId], references: [users.id] }),
}));