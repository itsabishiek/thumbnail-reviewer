"use client";

import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import Image from "next/image";
import { SignInButton, UserButton, useSession } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";

type HeaderProps = {};

const Header: React.FC<HeaderProps> = () => {
  const { isSignedIn } = useSession();
  const { theme } = useTheme();

  return (
    <div className="border-b">
      <div className="h-16 container flex justify-between items-center">
        <Link
          href="/"
          className="flex gap-2 items-center relative flex-shrink-0"
        >
          <Image
            className="rounded"
            src="/logo.png"
            alt="logo"
            width="35"
            height="35"
          />
          <span className="text-lg font-bold">ThumbnailReviewer</span>
        </Link>

        <div className="gap-4 hidden md:flex md:gap-8 text-xs md:text-base">
          {isSignedIn && (
            <>
              <Link href="/dashboard" className="link">
                Dashboard
              </Link>
              <Link href="/create" className="link">
                Create
              </Link>
              <Link href="/explore" className="link">
                Explore
              </Link>
            </>
          )}
        </div>

        <div className="flex gap-4 items-center">
          <>
            {isSignedIn ? (
              <>
                <UserButton
                  appearance={{
                    baseTheme: theme === "dark" ? dark : undefined,
                  }}
                />
              </>
            ) : (
              <SignInButton />
            )}
          </>

          <ModeToggle />
        </div>
      </div>
    </div>
  );
};
export default Header;
