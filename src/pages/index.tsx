import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";

import { api } from "~/utils/api";

import { MasonryInfiniteGrid } from "@egjs/react-infinitegrid";
import { useContext } from "react";

import { Album } from "~/components/Album";
import { Cart } from "~/components/Cart";
import { CartContext } from "~/providers/CartProvider";

const limit = 50;

export default function Home() {
  const { cart, addItem, removeItem } = useContext(CartContext);

  const { data: albums, fetchNextPage } =
    api.album.getDefaultAlbums.useInfiniteQuery(
      {},
      {
        getNextPageParam: (_, allPages) => {
          return allPages.length * limit;
        },
        initialCursor: 0,
      },
    );
  const utils = api.useUtils();
  const { mutate } = api.ratings.rateAlbum.useMutation({
    onMutate: async ({ albumId, rating }) => {
      const previousState = utils.album.getDefaultAlbums.getInfiniteData();
      utils.album.getDefaultAlbums.setData({}, (prev) => {
        const newAlbums = prev?.map((album) => {
          if (album.albumId === albumId) {
            return { ...album, rating };
          }
          return album;
        });

        return newAlbums;
      });
      return { previousState };
    },
    onError: (_, __, context) => {
      utils.album.getDefaultAlbums.setInfiniteData({}, context?.previousState);
    },
    onSettled: () => {
      void utils.album.getDefaultAlbums.invalidate();
    },
  });

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

      <main className=" flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#0C090A] to-[#191414]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Album Store
          </h1>
          <div className="flex flex-col items-center gap-2">
            <AuthShowcase />
          </div>
          <Cart />
          <MasonryInfiniteGrid
            className="mx-4 w-screen"
            gap={30}
            onRequestAppend={() => {
              void fetchNextPage();
            }}
          >
            {albums
              ? albums?.pages.map((page, i) =>
                  page.map((album) => {
                    const isInCart =
                      cart.findIndex(
                        (cartItem) => cartItem.album.albumId === album.albumId,
                      ) !== -1;

                    return (
                      <Album
                        album={album}
                        onClick={() =>
                          isInCart ? removeItem(album.albumId) : addItem(album)
                        }
                        data-grid-groupkey={i}
                        key={album.albumId}
                        rating={album.rating ?? 0}
                        setRating={(rating) =>
                          mutate({ albumId: album.albumId, rating })
                        }
                        isInCart={isInCart}
                      />
                    );
                  }),
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

  const isGuest = sessionData?.user.email?.includes("example.com");

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && (
          <span>
            {isGuest
              ? "Automatically signed in as a guest nicknamed"
              : "Logged in as "}{" "}
            {sessionData.user?.name}
          </span>
        )}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={isGuest ? () => void signIn("spotify") : () => void signOut()}
      >
        {isGuest ? "Sign in with spotify" : "Sign out"}
      </button>
    </div>
  );
}
