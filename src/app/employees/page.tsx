import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import EmployeeTableClient from "@/components/EmployeeTableClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "HRMS | Employees",
  description: "Employee management and listing page",
};

export default async function EmployeesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <>
    <main className="p-6">
      <EmployeeTableClient />
    </main>
    </>
  );
}
