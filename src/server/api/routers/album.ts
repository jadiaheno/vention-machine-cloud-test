import { sql, type SQL, type SQLChunk } from "drizzle-orm";
import { z } from "zod";

import {
    createTRPCRouter,
    publicProcedure
} from "~/server/api/trpc";
import { albums, albumUserRatings } from "~/server/db/schema";

interface Album {
    name: string;
    albumId: string;
    coverURL: string;
    rating?: number;
}

export const albumRouter = createTRPCRouter({
    getDefaultAlbums: publicProcedure
        .input(z.object({ cursor: z.number().default(0), limit: z.number().default(50) }))
        .query(async ({ ctx, input }) => {
            const sqlChunks: SQLChunk[] = [];
            sqlChunks.push(sql`select ${albums.albumId}, ${albums.coverURL}, ${albums.name} `);

            if (ctx.session?.user.id) {
                sqlChunks.push(sql`,${albumUserRatings.rating}`)
            }

            sqlChunks.push(sql`from ${albums}`);

            if (ctx.session?.user.id) {
                sqlChunks.push(sql` left join ${albumUserRatings}  on ${albums.albumId} = ${albumUserRatings.albumId} and ${albumUserRatings.userId} = ${ctx.session?.user.id}`);
            }
            sqlChunks.push(sql`limit ${input.limit} offset ${input.cursor}`);

            const finalSql: SQL = sql.join(sqlChunks, sql.raw(' '))

            return (await ctx.db.execute(finalSql)).map((album) => ({
                albumId: album.album_id,
                coverURL: album.cover_url,
                name: album.name,
                rating: album.rating
            } as Album))
        }),
});