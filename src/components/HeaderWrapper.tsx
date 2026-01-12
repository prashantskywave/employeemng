"use client"; 

import { usePathname } from "next/navigation";
import AppHeader from "./AppHeader";

const hideHeaderRoutes = ["/login"]; 

export default function HeaderWrapper() {
  const pathname = usePathname();
  const hideHeader = hideHeaderRoutes.includes(pathname);

  if (hideHeader) return null;
  return <AppHeader />;
}
