import { z } from "zod";

import {
    createTRPCRouter,
    publicProcedure
} from "~/server/api/trpc";

export const albumRouter = createTRPCRouter({
    getDefaultAlbums: publicProcedure
        .input(z.object({ cursor: z.number().default(0), limit: z.number().default(50) }))
        .query(async ({ ctx, input }) => {
            return await ctx.db.query.albums.findMany({
                offset: input.cursor,
                limit: input.limit
                // Tried to return a consistent random order, but it's not possible with the current ORM (order by RAND(seed))
            })
        }),
});