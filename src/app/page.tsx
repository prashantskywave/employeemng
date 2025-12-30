import EmployeeTableClient from "@/components/EmployeeTableClient";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "HRMS",
  description:
    "Manage employees, departments, roles, and status efficiently using the Employee Management System.",
};


export default function HomePage() {
  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Employee Management
      </h1>
      <EmployeeTableClient />
    </main>
  );
}