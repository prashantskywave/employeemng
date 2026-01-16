import Link from "next/link";
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

export default function SidebarMenu({
  collapsed,
}: {
  collapsed: boolean;
}) {
  return (
    <nav className="mt-4">
      {menu.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100"
        >
          <item.icon size={20} />
          {!collapsed && <span>{item.label}</span>}
        </Link>
      ))}
    </nav>
  );
}
