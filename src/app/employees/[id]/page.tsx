import { notFound } from "next/navigation";
import Link from "next/link";
import { BiDetail } from "react-icons/bi";
import { IoArrowBack } from "react-icons/io5";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { headers } from "next/headers";
import { Metadata } from "next";

interface Employee {
  _id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  contact: string;
  department: string;
  role: string;
  joiningDate: string;
  status: string;
  profileImage?: string;
}
export const metadata: Metadata = {
  title: "HRMS | Employees | Details",
  description: "View details of an employee in the Employee Management System.",
};


function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default async function EmployeeDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) notFound();

  const host = (await headers()).get("host");
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

  const res = await fetch(`${protocol}://${host}/api/employees/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) notFound();

  const employee: Employee = await res.json();

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-3xl shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl font-semibold">
            <BiDetail className="text-blue-500 text-2xl" />
            Employee Details
          </CardTitle>

          <Link
            href="/employees"
            className="flex items-center gap-1 text-black hover:underline"
          >
            <IoArrowBack className="text-lg" />
            Back
          </Link>
        </CardHeader>

        <CardContent>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-medium">Employee ID</label>
              <input
                value={employee.employeeId}
                readOnly
                className="w-full mt-1 px-3 py-2 border rounded bg-gray-50"
              />
            </div>

            <div>
              <label className="text-sm font-medium">First Name</label>
              <input
                value={employee.firstName}
                readOnly
                className="w-full mt-1 px-3 py-2 border rounded bg-gray-50"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Last Name</label>
              <input
                value={employee.lastName}
                readOnly
                className="w-full mt-1 px-3 py-2 border rounded bg-gray-50"
              />
            </div>


            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                value={employee.email}
                readOnly
                className="w-full mt-1 px-3 py-2 border rounded bg-gray-50"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Contact</label>
              <input
                value={employee.contact}
                readOnly
                className="w-full mt-1 px-3 py-2 border rounded bg-gray-50"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Department</label>
              <input
                value={employee.department}
                readOnly
                className="w-full mt-1 px-3 py-2 border rounded bg-gray-50"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Role</label>
              <input
                value={employee.role}
                readOnly
                className="w-full mt-1 px-3 py-2 border rounded bg-gray-50"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Joining Date</label>
              <input
                value={formatDate(employee.joiningDate)}
                readOnly
                className="w-full mt-1 px-3 py-2 border rounded bg-gray-50"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Status</label>
              <input
                value={employee.status}
                readOnly
                className="w-full mt-1 px-3 py-2 border rounded bg-gray-50"
              />
            </div>
            <div className="flex justify-center mb-6">
              {employee.profileImage ? (
                <img
                  src={
                    employee.profileImage.startsWith("http")
                      ? employee.profileImage
                      : `${protocol}://${host}/${employee.profileImage}`
                  }
                  alt="Profile"
                  className="h-28 w-28 rounded-full object-cover border"
                />

              ) : (
                <div className="h-28 w-28 rounded-full border flex items-center justify-center text-sm text-gray-400">
                  No Image
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
