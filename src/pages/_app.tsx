import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "~/utils/api";

import { CartProvider } from "~/providers/CartProvider";
import GuestSessionProvider from "~/providers/GuestSessionProvider";
import "~/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <GuestSessionProvider>
        <CartProvider>
          <Component {...pageProps} />
        </CartProvider>
      </GuestSessionProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
