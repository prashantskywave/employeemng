"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, User } from "lucide-react";

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
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.label}
            href={item.href}
            className={`
              flex items-center gap-5 px-6 py-3 rounded-lg
              w-full                  
              transition-colors duration-200
               ${isActive ? "bg-gray-400 text-white" : "hover:bg-gray-300 text-gray-800"}
             `}
          >
            <item.icon
              size={20}
              className={isActive ? "text-white" : "text-gray-800"}
            />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
