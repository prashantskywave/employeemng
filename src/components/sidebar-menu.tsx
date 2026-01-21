"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, User } from "lucide-react";
import { clsx } from "clsx";

const menu = [
  {
    label: "Employees",
    icon: Users,
    href: "/employees",
  },
  {
    label: "Profile",
    icon: User,
    href: "/profile",
  },
];

export default function SidebarMenu({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname();

  return (
    <nav className="mt-4">
      {menu.map((item) => {
        const isActive = item.href === "/"
          ? pathname === "/"
          : pathname.startsWith(item.href);

        return (
          <Link
            key={item.label}
            href={item.href}
            className={clsx(
              "flex items-center gap-3 px-2 py-2 w-full rounded-sm transition-all duration-200",
              isActive ? "bg-black text-white" : "hover:bg-gray-300 text-black"
            )}
          >
            <item.icon
              size={20}
              className={clsx(
                "shrink-0 min-w-[20px]",
                isActive ? "text-white" : "text-gray-800"
              )}
            />
            <span
              className={clsx(
                "overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out",
                collapsed
                  ? "opacity-0 max-w-0 translate-x-[-6px]"
                  : "opacity-100 max-w-[140px] translate-x-0"
              )}
            >
              {item.label}
            </span>

          </Link>
        );
      })}
    </nav>
  );
}
