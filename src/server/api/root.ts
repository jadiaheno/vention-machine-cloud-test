
import { createTRPCRouter } from "~/server/api/trpc";
import { albumRouter } from "./routers/album";
import { cartRouter } from "./routers/cart";
import { ratingRouter } from "./routers/rating";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  album: albumRouter,
  cart: cartRouter,
  ratings: ratingRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
