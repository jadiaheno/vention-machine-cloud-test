import { z } from "zod";

import { and, eq, sql } from "drizzle-orm";
import {
    createTRPCRouter,
    protectedProcedure
} from "~/server/api/trpc";
import { carts } from "~/server/db/schema";


export const cartRouter = createTRPCRouter({
    get: protectedProcedure.query(async ({ ctx }) => {
        return await ctx.db.query.carts.findMany({
            where: eq(carts.userId, ctx.session.user.id),
            with: {
                album: {
                    columns: {
                        name: true,
                        albumId: true,
                        coverURL: true,
                    }
                },
            },
            columns: {
                quantity: true,
            }
        })
    }),
    addOrIncrementAlbum: protectedProcedure.input(z.object({
        albumId: z.string().uuid(),
    })).mutation(async ({ ctx, input }) => {
        return await ctx.db.insert(carts).values({
            userId: ctx.session.user.id,
            albumId: input.albumId,
            quantity: 1
        }).onConflictDoUpdate({
            target: [carts.userId, carts.albumId],
            set: {
                quantity: sql`${carts.quantity} + 1`,
            }
        });
    }),
    removeAlbum: protectedProcedure.input(z.object({
        albumId: z.string().uuid(),
    })).mutation(async ({ ctx, input }) => {
        return await ctx.db.delete(carts).where(and(
            eq(carts.userId, ctx.session.user.id),
            eq(carts.albumId, input.albumId)
        ));
    }),
});
