"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import SidebarMenu from "./sidebar-menu";
import SidebarFooter from "./sidebar-footer";
import clsx from "clsx";

export default function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={clsx(
        "hidden md:flex h-screen bg-gray-200 flex-col overflow-hidden transition-[width] duration-300 ease-in-out",
        collapsed ? "w-12" : "w-48"
      )}
    >
      <div className="flex items-center h-14 px-3 gap-3">
        <button onClick={() => setCollapsed(!collapsed)}>
          <Menu size={20} />
        </button>

        <span
          className={clsx(
            "text-lg font-semibold whitespace-nowrap transition-all duration-300",
            collapsed ? "opacity-0 scale-95 translate-x-[-8px]"
              : "opacity-100 scale-100 translate-x-0"
          )}
        >
          HRMS
        </span>
      </div>

      <div className="flex-1 px-0.5">
        <SidebarMenu collapsed={collapsed} />
      </div>

      <div className="px-1 py-4">
        <SidebarFooter collapsed={collapsed} />
      </div>
    </aside>
  );
}
