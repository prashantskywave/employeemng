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
        "hidden md:flex h-screen bg-gray-200  transition-all duration-300 flex-col",
        collapsed ? "md:w-16" : "md:w-50"
      )}
    >
      {/* Header */}
      <div
        className={clsx(
          "flex items-center px-4 py-4  h-16",
          collapsed ? "justify-center" : "justify-center gap-2 "
        )}
      >
        <button onClick={() => setCollapsed(!collapsed)}>
          <Menu size={20} />
        </button>

        {!collapsed && (
          <h1 className="text-lg font-semibold">
            HRMS  
          </h1>
        )}
      </div>

      {/* Menu */}
      <div className="flex-1 w-full flex justify-center">
        <SidebarMenu collapsed={collapsed} />
      </div>


      {/* Footer */}
      <div className="px-4 py-4 flex justify-center">
        <SidebarFooter collapsed={collapsed} />
      </div>
    </aside>
  );
}
