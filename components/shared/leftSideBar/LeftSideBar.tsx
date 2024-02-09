import { SignedOut } from "@clerk/nextjs";
import NavContent from "../navContent/NavContent";
import Link from "next/link";
import Image from "next/image";
import Account from "@/public/assets/icons/account.svg";
import SignUp from "@/public/assets/icons/sign-up.svg";
import { Button } from "@/components/ui/button";

export default function LeftSideBar() {
  return (
    <section className=" background-light900_dark200 light-border shadow-light-300 sticky left-0 top-0 flex h-screen flex-col justify-between overflow-y-hidden border-r p-6 pt-28 max-sm:hidden lg:w-[266px] dark:shadow-none">
      <div className="flex flex-1 flex-col gap-6">
        <NavContent />
        <SignedOut>
          <div className=" flex flex-col gap-3">
            <Link href="sign-in">
              <Button className=" small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
                <Image
                  src={Account}
                  alt="account icon"
                  width={20}
                  height={20}
                  className="invert-colors lg:hidden"
                />
                <span className=" primary-text-gradient max-lg:hidden">
                  Log in
                </span>
              </Button>
            </Link>
            <Link href="sign-up">
              <Button className=" small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
                <Image
                  src={SignUp}
                  alt="sign up icon"
                  width={20}
                  height={20}
                  className="invert-colors lg:hidden"
                />
                <span className=" primary-text-gradient max-lg:hidden">
                  Sign up
                </span>
              </Button>
            </Link>
          </div>
        </SignedOut>
      </div>
    </section>
  );
}
