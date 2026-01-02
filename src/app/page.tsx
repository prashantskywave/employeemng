import type { Metadata } from "next";
import { redirect } from "next/navigation"

export const metadata: Metadata = {
title: "HRMS",
description:
"Manage employees, departments, roles, and status efficiently using the Employee Management System.",
 };

export default function HomePage() {
  redirect("/login");
}
