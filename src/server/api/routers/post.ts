import { z } from "zod";

import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { v5 as uuidv5 } from "uuid";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { albums, posts } from "~/server/db/schema";
import { SpotifyLikedResponse } from "./types.spotify.liked";
import { SpotifyTopResponse } from "./types.spotify.top";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await ctx.db.insert(posts).values({
        name: input.name,
        createdById: ctx.session.user.id,
      });
    }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.posts.findFirst({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  getDefaultAlbums: publicProcedure
    .input(z.object({ cursor: z.number().default(0), limit: z.number().default(50) }))
    .query(async ({ ctx, input }) => {

      // Get the user access token
      // const account = await ctx.db.query.accounts.findFirst({
      //   columns: {
      //     access_token: true,
      //   },
      //   where: (accounts, { eq }) => eq(accounts.userId, ctx.session.user.id),
      // });

      // if (!account?.access_token) {
      //   throw new Error("No account found");
      // }

      // await getItemsFromTop(ctx.db, account.access_token);
      // await getItemsFromLiked(ctx.db, account.access_token);


      //   const albumCount = await ctx.db.select({ value: count() }).from(albums);


      return await ctx.db.query.albums.findMany({
        offset: input.cursor,
        limit: input.limit,
      })

      // return {
      //   count: albumCount[0]?.value ?? 0,
      //   albums: _albums ?? []
      // }


    }),
});

async function getItemsFromTop(
  db: PostgresJsDatabase<
    typeof import("../../db/schema")
  >,
  access_token: string,
  url = "https://api.spotify.com/v1/me/top/tracks?limit=50",
) {
  // Getting the user's top tracks from spotify api
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Could not get top tracks");
  }

  const items = [] as SpotifyTopResponse["items"];
  const data = (await response.json()) as SpotifyTopResponse;
  items.push(...data.items);
  const _albums = getAlbumFromItem(items);

  await db.insert(albums).values(_albums).onConflictDoNothing();

  if (data.next) {
    console.log("next", data.next);
    await getItemsFromTop(db, access_token, data.next);
  }
  return items;
}

async function getItemsFromLiked(
  db: PostgresJsDatabase<
    typeof import("../../db/schema")
  >,
  access_token: string,
  url = "https://api.spotify.com/v1/me/tracks?limit=50&",
) {
  // Getting the user's top tracks from spotify api
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      "Could not get liked tracks: " + response.statusText + response.status,
    );
  }

  console.log(
    "success - liked",
    response.ok,
    response.statusText,
    response.status,
  );

  const items = [] as SpotifyLikedResponse["items"][0]["track"][];
  const data = (await response.json()) as SpotifyLikedResponse;
  items.push(...data.items.map((item) => item.track));

  const _albums = getAlbumFromItem(items);

  await db.insert(albums).values(_albums).onConflictDoNothing();

  if (data.next) {
    console.log("next", data.next);
    await getItemsFromLiked(db, access_token, data.next);
  }
}

function getAlbumFromItem(items: SpotifyTopResponse["items"]) {


  return items.map((item) => {
    const image = item.album.images.reduce((prev, current) => {
      return prev.height > current.height ? prev : current;
    }, { height: 0, url: "" });
    return {
      name: item.album.name,
      coverURL: image.url,
      albumId: uuidv5(item.album.id, uuidv5.URL) as string,
    };
  });
}
