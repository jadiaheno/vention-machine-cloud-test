import Image from "next/image";
import { useContext } from "react";
import { CartContext, type CartInterface } from "~/providers/CartProvider";

export const Cart = () => {
  const { cart, removeItem } = useContext(CartContext);
  return (
    <div className="py-12 sm:py-16 lg:py-20">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center">
          <h1 className="text-2xl font-semibold text-gray-900">Your Cart</h1>
        </div>
        <div className="mx-auto mt-8 max-w-md md:mt-12">
          <div className="rounded-3xl bg-white shadow-lg">
            <div className="px-4 py-6 sm:px-8 sm:py-10">
              <div className="flow-root">
                <ul className="-my-8">
                  {cart?.map((item) => (
                    <CartItem
                      key={item.album.albumId}
                      cartItem={item}
                      removeItem={removeItem}
                    />
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface CartItemProps {
  cartItem: CartInterface;
  removeItem: (albumId: string) => void;
}

function CartItem({ cartItem, removeItem }: CartItemProps) {
  return (
    <li className="flex flex-col space-y-3 py-6 text-left sm:flex-row sm:space-x-5 sm:space-y-0">
      <div className="relative shrink-0">
        <span className="absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full border bg-white text-sm font-medium text-gray-500 shadow sm:-right-2 sm:-top-2">
          {cartItem.quantity}
        </span>
        <Image
          className="h-24 w-24 max-w-full rounded-lg object-cover"
          src={cartItem.album.coverURL}
          alt="Album cover"
          width={24}
          height={24}
        />
      </div>
      <div className="relative flex flex-1 flex-col justify-between">
        <div className="sm:col-gap-5 sm:grid sm:grid-cols-2">
          <div className="pr-8 sm:pr-5">
            <p className="text-base font-semibold text-gray-900">
              {cartItem.album.name}
            </p>
            <p className="mx-0 mb-0 mt-1 text-sm text-gray-400">36EU - 4US</p>
          </div>
          <div className="mt-4 flex items-end justify-between sm:mt-0 sm:items-start sm:justify-end">
            <p className="w-20 shrink-0 text-base font-semibold text-gray-900 sm:order-2 sm:ml-8 sm:text-right">
              $9.99
            </p>
          </div>
        </div>
        <div className="absolute right-0 top-0 flex sm:bottom-0 sm:top-auto">
          <button
            onClick={() => removeItem(cartItem.album.albumId)}
            type="button"
            className="flex rounded p-2 text-center text-gray-500 transition-all duration-200 ease-in-out hover:text-gray-900 focus:shadow"
            title="Remove item"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </button>
        </div>
      </div>
    </li>
  );
}
