import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { isAuthenticated, signOut } from "@/lib/actions/auth.action";

const Layout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/sign-in");

  return (
    <div className="root-layout">
      <nav className="flex justify-between items-center p-4 border-b">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="MockMate Logo" width={38} height={32} />
          <h2 className="text-primary-100">PrepWise</h2>
        </Link>

        <form action={signOut}>
          <button
            type="submit"
            className="text-sm px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
          >
            Logout
          </button>
        </form>
      </nav>

      {children}
    </div>
  );
};

export default Layout;
