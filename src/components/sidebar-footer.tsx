"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function SidebarFooter({
  collapsed,
}: {
  collapsed: boolean;
}) {
  return (
    <div className="border-t p-4">
      <button
        onClick={() => signOut()}
        className="flex items-center gap-2 text-red-600 hover:text-red-700 "
      >
        <LogOut size={20} />
        {!collapsed && <span>Logout</span>}
      </button>
    </div>
  );
}
