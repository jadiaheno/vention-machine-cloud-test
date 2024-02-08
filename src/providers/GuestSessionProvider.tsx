import { signIn, useSession } from "next-auth/react";
import { useEffect, type ReactNode } from "react";

export default function GuestSessionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { status, update } = useSession();
  useEffect(() => {
    if (status === "unauthenticated") {
      // login as anonymous
      signIn("credentials", {})
        .then(async () => {
          await update();
          /* do nothing */
          console.info("Logged in as anonymous");
        })
        .catch((error) => {
          console.error("Failed to login as anonymous", error);
        });
    }
  }, [status]);
  return <>{children}</>;
}
