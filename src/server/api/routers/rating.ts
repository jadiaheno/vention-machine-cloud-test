import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure
} from "~/server/api/trpc";
import { albumUserRatings } from "~/server/db/schema";


export const ratingRouter = createTRPCRouter({
    rateAlbum: protectedProcedure
        .input(z.object({
            rating: z.number().int().min(1).max(5),
            albumId: z.string().uuid(),
        }))
        .mutation(async ({ ctx, input }) => {
            return await ctx.db.insert(albumUserRatings).values({
                userId: ctx.session.user.id,
                albumId: input.albumId,
                rating: input.rating
            }).onConflictDoUpdate({
                target: [albumUserRatings.albumId, albumUserRatings.userId],
                set: {
                    rating: input.rating
                }
            });
        })
});