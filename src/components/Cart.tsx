import Image from "next/image";
import { useContext } from "react";
import { CartContext, CartInterface } from "~/contexts/CartContext";

export const Cart = () => {
  const { cart, removeItem } = useContext(CartContext);
  return (
    <section className="h-screen bg-gray-100 py-12 sm:py-16 lg:py-20">
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

              <div className="mt-6 space-y-3 border-b border-t py-8">
                <div className="flex items-center justify-between">
                  <p className="text-gray-400">Subtotal</p>
                  <p className="text-lg font-semibold text-gray-900">
                    ${cart.reduce((acc, item) => acc + item.quantity * 9.99, 0)}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-gray-400">Shipping</p>
                  <p className="text-lg font-semibold text-gray-900">$8.00</p>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">Total</p>
                <p className="text-2xl font-semibold text-gray-900">
                  <span className="text-xs font-normal text-gray-400">USD</span>{" "}
                  $
                  {cart.reduce((acc, item) => acc + item.quantity * 9.99, 0) +
                    8}
                </p>
              </div>
              <div className="mt-6 text-center">
                <button
                  type="button"
                  className="group inline-flex w-full items-center justify-center rounded-md bg-orange-500 px-6 py-4 text-lg font-semibold text-white transition-all duration-200 ease-in-out hover:bg-gray-800 focus:shadow"
                >
                  Place Order
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-4 h-6 w-6 transition-all group-hover:ml-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
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
          alt=""
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
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
                className=""
              />
            </svg>
          </button>
        </div>
      </div>
    </li>
  );
}
