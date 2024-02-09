"use client";

import { sideBarLinks } from "@/constants";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function NavContent({ isSide = true }: { isSide?: boolean }) {
  const pathname = usePathname();
  return (
    <section className="flex h-full flex-col gap-6 pt-16">
      {sideBarLinks.map((item, index) => {
        const isActive =
          (pathname.includes(item.route) && item.route.length > 1) ||
          pathname === item.route;
        return (
          <Link
            key={index}
            href={item.route}
            className={`${isActive ? " primary-gradient text-light-900 rounded-lg " : "text-dark300_light900"} flex items-center justify-start gap-4 bg-transparent p-4`}
          >
            <Image
              src={item.imgURL}
              alt={item.label}
              width={20}
              height={20}
              className={`${isActive ? "" : " invert-colors"}`}
            />
            <p
              className={`${isActive ? "base-bold" : "base-medium"} ${isSide && "max-lg:hidden"} `}
            >
              {item.label}
            </p>
          </Link>
        );
      })}
    </section>
  );
}
