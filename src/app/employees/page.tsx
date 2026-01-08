import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import EmployeeTableClient from "@/components/EmployeeTableClient";
import AppHeader from "@/components/AppHeader";

export default async function EmployeesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <>
    <AppHeader />

    <main className="p-6">
      <EmployeeTableClient />
    </main>
    </>
  );
}
