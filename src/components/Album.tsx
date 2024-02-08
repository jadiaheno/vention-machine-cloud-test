import Image from "next/image";
import { type CartInterface } from "~/providers/CartProvider";
import { Rating } from "./Rating";

interface AlbumItemProps {
  album: CartInterface["album"];
  rating?: number;
  setRating: (rating: number) => void;
  onClick: (album: CartInterface["album"]) => void;
  isInCart: boolean;
}

export const Album = ({
  album,
  onClick,
  rating = 0,
  setRating,
  isInCart = false,
}: AlbumItemProps) => (
  <div className="item hover:z-10 hover:scale-150">
    <div className="max-w-xs rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800">
      <Image
        className="w-full rounded-t-lg"
        src={album.coverURL}
        alt="Album cover"
        width={300}
        height={300}
      />
      <div className="p-5">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {album.name}
        </h5>
        <Rating rating={rating} setRating={setRating} />
        <button
          onClick={() => onClick(album)}
          className={`${isInCart ? "bg-white" : "bg-shopify-green"} inline-flex  items-center   rounded-lg px-3 py-2 text-center text-sm font-medium hover:text-shopify-green hover:ring-shopify-green ${isInCart ? "black" : "text-white"} hover:bg-white focus:outline-none focus:ring-4 focus:ring-blue-300`}
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
              d={
                isInCart
                  ? "M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                  : "M12 4.5v15m7.5-7.5h-15"
              }
            />
          </svg>
          {isInCart ? "Remove from cart" : "Add to cart"}
        </button>
      </div>
    </div>
  </div>
);
