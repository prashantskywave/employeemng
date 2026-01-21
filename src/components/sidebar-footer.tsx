"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import clsx from "clsx";

export default function SidebarFooter({
  collapsed,
}: {
  collapsed: boolean;
}) {
  return (
    <div className="border-t px-2 py-3">
      <button
        onClick={() => signOut()}
        className="flex items-center gap-2 text-red-600 hover:text-red-700 "
      >
        <LogOut size={20} />
        <span
          className={clsx(
            "ml-1 overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out",
            collapsed
              ? "opacity-0 max-w-0 translate-x-[-6px]"
              : "opacity-100 max-w-[140px] translate-x-0"
          )}
        >
          Logout
        </span>
      </button>
    </div>
  );
}
