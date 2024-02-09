import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import Hamburger from "@/public/assets/icons/hamburger.svg";
import DevFlow from "@/public/assets/images/site-logo.svg";
import Link from "next/link";

import Image from "next/image";
import { SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import NavContent from "../navContent/NavContent";

export default function MobileNavBar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Image
          src={Hamburger}
          alt="hamburger button"
          width={24}
          height={24}
          className=" invert-colors sm:hidden"
        />
      </SheetTrigger>
      <SheetContent
        side="left"
        className=" background-light900_dark200 border-none"
      >
        <Link href="/" className=" flex items-center gap-1 ">
          <Image src={DevFlow} alt={"DevFlow"} width={23} height={23} />
          <p className=" h2-bold font-spaceGrotesk text-dark100_light900">
            Dev <span className=" text-primary-500">Overflow</span>
          </p>
        </Link>
        <div>
          <SheetClose asChild>
            <NavContent isSide={false} />
          </SheetClose>
          <SignedOut>
            <div className=" flex flex-col gap-3">
              <SheetClose asChild>
                <Link href="sign-in">
                  <Button className=" small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
                    <span className=" primary-text-gradient">Log in</span>
                  </Button>
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link href="sign-up">
                  <Button className=" small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
                    Sign up
                  </Button>
                </Link>
              </SheetClose>
            </div>
          </SignedOut>
        </div>
      </SheetContent>
    </Sheet>
  );
}
