import LeftSideBar from "@/components/shared/leftSideBar/LeftSideBar";
import Navbar from "@/components/shared/navbar/Navbar";
import RightSideBar from "@/components/shared/rightSideBar/RightSideBar";
import React from "react";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className=" background-light850_dark100 relative min-h-screen">
      <Navbar />
      <div className=" flex">
        <LeftSideBar />
        <section className=" min-h-ob flex flex-1 flex-col px-6 pb-6 pt-36 max-md:pb-14 sm:px-14">
          <div className=" mx-auto size-full max-w-5xl">{children}</div>
        </section>
        <RightSideBar />
      </div>
      <div
        className={
          " z-90 absolute bottom-0 shadow-light-300 max-sm:hidden lg:w-[266px] dark:shadow-none"
        }
      >
        <Toaster />
      </div>
    </main>
  );
}
