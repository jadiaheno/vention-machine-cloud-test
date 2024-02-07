import { z } from "zod";

import { and, eq, sql } from "drizzle-orm";
import { type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import {
    createTRPCRouter,
    protectedProcedure
} from "~/server/api/trpc";
import { carts } from "~/server/db/schema";

import type * as DBSchema from "../../db/schema";


const getCart = async (db: PostgresJsDatabase<typeof DBSchema>, userId: string) => {
    return await db.query.carts.findMany({
        where: eq(carts.userId, userId),
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
}

export const cartRouter = createTRPCRouter({
    get: protectedProcedure.query(async ({ ctx }) => {
        return await getCart(ctx.db, ctx.session.user.id);
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
