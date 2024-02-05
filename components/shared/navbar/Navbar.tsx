import Link from "next/link";
import React from "react";
import Image from "next/image";
import DevFlow from "./../../../public/assets/images/site-logo.svg";
import { SignedIn, UserButton } from "@clerk/nextjs";
import Theme from "./Theme";
import MobileNavBar from "./MobileNav";
import GlobalSearch from "../search/GlobalSearch";

export default function Navbar() {
  return (
    <nav className="flex-between background-light900_dark200 shadow-light-300 fixed z-50 w-full gap-5 p-6 sm:px-12 dark:shadow-none">
      <Link href="/" className=" flex items-center gap-1 ">
        <Image src={DevFlow} alt={"DevFlow"} width={23} height={23} />
        <p className=" h2-bold font-spaceGrotesk text-dark-100 dark:text-light-900 max-sm:hidden">
          Dev <span className=" text-primary-500">Overflow</span>
        </p>
      </Link>
      <GlobalSearch />
      <div className=" flex-between gap-5">
        <Theme />
        <SignedIn>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "h-10 w-10",
              },
              variables: {
                colorPrimary: "#ff7000",
              },
            }}
          />
        </SignedIn>
        <MobileNavBar />
      </div>
    </nav>
  );
}
