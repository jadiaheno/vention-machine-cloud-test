import Image from "next/image";
import { type CartInterface } from "~/contexts/CartContext";

interface AlbumItemProps {
  album: CartInterface["album"];
  onClick: (album: CartInterface["album"]) => void;
}

export const AlbumItem = ({ album, onClick }: AlbumItemProps) => (
  <div className="item">
    <div className="max-w-xs rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800">
      <Image
        className="w-full rounded-t-lg"
        src={album.coverURL}
        alt=""
        width={300}
        height={300}
      />
      <div className="p-5">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {album.name}
        </h5>

        <button
          onClick={() => onClick(album)}
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
        </button>
      </div>
    </div>
  </div>
);
