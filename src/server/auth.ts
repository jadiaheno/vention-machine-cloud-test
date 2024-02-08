import { DrizzleAdapter } from "@auth/drizzle-adapter";
import {
  type GetServerSidePropsContext,
  type NextApiRequest,
  type NextApiResponse,
} from "next";
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
import { eq } from "drizzle-orm";
import { type User } from "next-auth";
import { decode, encode } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { parseCookies, setCookie } from "nookies";
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
  type Config,
} from "unique-names-generator";
import { env } from "~/env";
import { db } from "~/server/db";
import { createTable, sessions, users } from "~/server/db/schema";

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

const adapter = {
  ...(DrizzleAdapter(db, createTable) as Adapter),
  async getSessionAndUser(sessionToken: string) {
    const userAndSession = await db.query.sessions.findFirst({
      where: eq(sessions.sessionToken, sessionToken),
      with: {
        user: true,
      },
    });
    if (!userAndSession) return null;
    const { user, ...session } = userAndSession;
    return { user: user, session: session };
  },
};
const session = {
  // strategy: "database",
  maxAge: 30 * 24 * 60 * 60, // 30 days
  updateAge: 24 * 60 * 60, // 24 hours
};

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: (
  req: NextApiRequest,
  res: NextApiResponse,
) => NextAuthOptions = (req, res) => {
  return {
    callbacks: {
      session: async ({ session, user }) => {
        return {
          ...session,
          user: {
            ...session.user,
            id: user?.id,
          },
        };
      },
      async signIn({ user }) {
        if (
          req.query.nextauth?.includes("callback") &&
          req.query.nextauth?.includes("credentials") &&
          req.method === "POST"
        ) {
          if (user && "id" in user) {
            const sessionToken = randomUUID();
            const sessionExpiry = new Date(Date.now() + session.maxAge * 1000);

            adapter.createSession &&
              (await adapter.createSession({
                sessionToken: sessionToken,
                userId: user.id,
                expires: sessionExpiry,
              }));

            setCookie({ res }, "next-auth.session-token", sessionToken, {
              expires: sessionExpiry,
              path: "/",
            });
          }
        }
        return true;
      },
    },
    jwt: {
      encode(params) {
        if (
          req.query.nextauth?.includes("callback") &&
          req.query.nextauth?.includes("credentials") &&
          req.method === "POST"
        ) {
          const cookies = parseCookies({ req }) as Record<string, string>;
          const nextSessionTokenCookie = cookies["next-auth.session-token"];
          if (nextSessionTokenCookie) return nextSessionTokenCookie;
          else return "";
        }
        // Revert to default behaviour when not in the credentials provider callback flow
        return encode(params);
      },
      async decode(params) {
        if (
          req.query.nextauth?.includes("callback") &&
          req.query.nextauth?.includes("credentials") &&
          req.method === "POST"
        ) {
          return null;
        }
        // Revert to default behaviour when not in the credentials provider callback flow
        return decode(params);
      },
    },
    adapter,
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
        async authorize(creds, req) {
          return createAnonymousUser();
        },
      }),
    ],
  };
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
  return getServerSession(ctx.req, ctx.res, authOptions(ctx.req, ctx.res));
};

const createAnonymousUser = async (): Promise<User> => {
  // generate a random name and email for this anonymous user
  const customConfig: Config = {
    dictionaries: [adjectives, colors, animals],
    separator: "-",
    length: 3,
    style: "capital",
  };
  const unique_handle: string = uniqueNamesGenerator(customConfig).replaceAll(
    " ",
    "",
  );

  const createdUser = {
    id: randomUUID(),
    email: `${unique_handle.toLowerCase()}@example.com`,
    name: unique_handle.split("-").slice(1).join(" "),
    image: "/favicon.ico",
    provider: "anonymous",
  };

  await db.insert(users).values(createdUser).returning({ id: users.id });

  return createdUser;
};
