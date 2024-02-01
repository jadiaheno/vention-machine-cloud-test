import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";

import { api } from "~/utils/api";

import { MasonryInfiniteGrid } from "@egjs/react-infinitegrid";
import Image from "next/image";

const limit = 50;

const Item = ({
  name,
  coverURL,
}: {
  name: string;
  albumId: string;
  coverURL: string;
}) => (
  <div className="item">
    <div className="max-w-xs rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800">
      <Image
        className="w-full rounded-t-lg"
        src={coverURL}
        alt=""
        width={300}
        height={300}
      />
      <div className="p-5">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {name}
        </h5>

        <a
          href="#"
          className="bg-shopify-green hover:text-shopify-green  hover:ring-shopify-green   inline-flex items-center rounded-lg px-3 py-2 text-center text-sm font-medium text-white hover:bg-white focus:outline-none focus:ring-4 focus:ring-blue-300 "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Add to cart
        </a>
      </div>
    </div>
  </div>
);

export default function Home() {
  const hello = api.post.hello.useQuery({ text: "from tRPC" });

  const { data: albums, fetchNextPage } =
    api.post.getDefaultAlbums.useInfiniteQuery(
      {},
      {
        getNextPageParam: (_, allPages) => {
          return allPages.length * limit;
        },
        initialCursor: 0,
      },
    );

  return (
    <>
      <Head>
        <title>Jonathan Adiaheno for Vention</title>
        <meta
          name="description"
          content="This is a take-home test for vention"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className=" flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#1db954] to-[#191414]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Album Store
          </h1>
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white">
              {hello.data ? hello.data.greeting : "Loading tRPC query..."}
            </p>
            <AuthShowcase />
          </div>
          <MasonryInfiniteGrid
            className="mx-4 w-screen"
            gap={30}
            onRequestAppend={(e) => {
              void fetchNextPage();
            }}
          >
            {albums
              ? albums.pages.map((page, i) =>
                  page.map((album) => (
                    <Item
                      name={album.name}
                      albumId={album.albumId}
                      coverURL={album.coverURL}
                      data-grid-groupkey={i}
                      key={album.albumId}
                    />
                  )),
                )
              : null}
          </MasonryInfiniteGrid>
          ;
        </div>
      </main>
    </>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.post.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined },
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
}
