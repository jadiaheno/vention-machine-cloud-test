import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import SpotifyProvider, {
  type SpotifyProfile,
} from "next-auth/providers/spotify";

import { randomUUID } from "crypto";
import { type User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { adjectives, animals, colors, uniqueNamesGenerator, type Config } from 'unique-names-generator';
import { env } from "~/env";
import { db } from "~/server/db";
import { createTable } from "~/server/db/schema";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: async ({ session, user }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
        },
      };
    },
  },
  adapter: DrizzleAdapter(db, createTable) as Adapter,
  providers: [
    {
      ...SpotifyProvider({
        clientId: env.SPOTIFY_CLIENT_ID,
        clientSecret: env.SPOTIFY_CLIENT_SECRET,
      }),
      authorization:
        "https://accounts.spotify.com/authorize?scope=user-read-email,user-top-read,user-library-read",
      profile(profile: SpotifyProfile, tokens) {
        return {
          name: profile.display_name,
          image: profile.images?.[1]?.url,
          ...profile,
          ...tokens,
        };
      },
    },
    CredentialsProvider({
      name: "anonymous",
      credentials: {},
      async authorize() {
        return createAnonymousUser();
      },
    }),
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};


const createAnonymousUser = (): User => {
  // generate a random name and email for this anonymous user
  const customConfig: Config = {
    dictionaries: [adjectives, colors, animals],
    separator: '-',
    length: 3,
    style: 'capital'
  };
  // handle is simple-red-aardvar
  const unique_handle: string = (uniqueNamesGenerator(customConfig)).replaceAll(' ', '');
  // real name is Red Aardvark
  const unique_realname: string = unique_handle.split('-').slice(1).join(' ');
  const unique_uuid: string = randomUUID();

  return {
    id: unique_uuid,
    email: `${unique_handle.toLowerCase()}@example.com`,
    name: unique_realname,
    image: "",
    provider: "anonymous"
  };
};