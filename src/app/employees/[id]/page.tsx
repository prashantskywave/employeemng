import { notFound } from "next/navigation";

interface Employee {
  _id: string;
  name: string;
  email: string;
  contact: string;
  department: string;
  role: string;
  joiningDate: string;
}

export default async function EmployeeDetails({ params }: { params: { id: string } }) {
  const id = params.id; 
  if (!id) notFound();

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/employees/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) notFound();
  const employee: Employee = await res.json();

  return (
    <div className="p-6 max-w-md mx-auto border rounded-md shadow-md">
      <h1 className="text-2xl font-bold mb-4">Employee Details</h1>
      <p><strong>ID:</strong> {employee._id}</p>
      <p><strong>Name:</strong> {employee.name}</p>
      <p><strong>Email:</strong> {employee.email}</p>
      <p><strong>Contact:</strong> {employee.contact}</p>
      <p><strong>Department:</strong> {employee.department}</p>
      <p><strong>Role:</strong> {employee.role}</p>
      <p><strong>Joining Date:</strong> {employee.joiningDate}</p>

      <button
        onClick={() => history.back()}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Back
      </button>
    </div>
  );
}
