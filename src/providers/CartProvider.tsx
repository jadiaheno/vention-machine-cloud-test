// Create  a cart context to manage the cart state
import { useSession } from "next-auth/react";
import React from "react";
import { api } from "~/utils/api";

export interface CartInterface {
  quantity: number;
  album: {
    name: string;
    albumId: string;
    coverURL: string;
  };
}

// noop utils
const noop = () => ({});

export const CartContext = React.createContext<{
  cart: CartInterface[];
  addItem: (album: CartInterface["album"]) => void;
  removeItem: (albumId: string) => void;
}>({
  cart: [],
  addItem: (_) => noop,
  removeItem: (_) => noop,
});

const addCartItem = (
  prevCart: CartInterface[],
  { albumId, ...rest }: CartInterface["album"],
) => {
  const cartItem = prevCart.find((item) => item.album.albumId === albumId);
  if (cartItem) {
    return prevCart.map((item) =>
      item.album.albumId === albumId
        ? { ...item, quantity: item.quantity + 1 }
        : item,
    );
  }
  return [
    ...prevCart,
    {
      album: { albumId, ...rest },
      quantity: 1,
    },
  ];
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: sessionData } = useSession();
  const utils = api.useUtils();
  const { data: cart, refetch } = api.cart.get.useQuery(undefined, {
    enabled: sessionData?.user !== undefined,
    initialData: [],
  });

  const { mutate: AddOrIncrementAlbum } =
    api.cart.addOrIncrementAlbum.useMutation({
      onMutate: async (newAlbum) => {
        await utils.cart.get.cancel();
        // Snapshot the previous value
        const previousCart = utils.cart.get.getData();
        // Optimistically update to the new value
        utils.cart.get.setData(undefined, (oldCart) => {
          if (!oldCart) {
            return oldCart;
          }
          return addCartItem(oldCart, newAlbum as CartInterface["album"]);
        });
        return { previousCart };
      },
      onError: (err, __, context) => {
        // Rollback to the previous value if mutation fails
        utils.cart.get.setData(undefined, context?.previousCart);
      },
      onSettled: () => {
        void utils.cart.get.invalidate();
        void refetch();
      },
    });

  const { mutate: removeAlbum } = api.cart.removeAlbum.useMutation({
    onMutate: async (album) => {
      await utils.cart.get.cancel();
      // Snapshot the previous value
      const previousCart = utils.cart.get.getData();
      // Optimistically update to the new value
      utils.cart.get.setData(undefined, (oldCart) => {
        if (!oldCart) {
          return oldCart;
        }
        return oldCart.filter((item) => item.album.albumId !== album.albumId);
      });
      return { previousCart };
    },
    onError: (err, __, context) => {
      // Rollback to the previous value if mutation fails
      utils.cart.get.setData(undefined, context?.previousCart);
    },
  });

  const addItem = (addedAlbum: CartInterface["album"]) => {
    AddOrIncrementAlbum(addedAlbum);
  };

  const removeItem = (albumId: string) => {
    removeAlbum({ albumId });
  };

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem }}>
      {children}
    </CartContext.Provider>
  );
};
