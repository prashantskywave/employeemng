import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import EmployeeTableClient from "@/components/EmployeeTableClient";

export default async function EmployeesPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Employee Management
      </h1>
      <EmployeeTableClient />
    </main>
  );
}
