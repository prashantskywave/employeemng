async function getEmployee(id: string) {
  const res = await fetch(
    `http://localhost:5000/api/employees/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return null;
  }

  return res.json();
}
export default async function EmployeeProfile({
params,
}: {
  params: { id: string };
}) {
  // const { id } = await params;

 const employee = await getEmployee(params.id);

  if (!employee) {
    return <p className="p-6">Employee not found</p>;
  }

  return (
    <div className="p-6">
      <h1><b>{employee.name}</b></h1>
      <p><b>Email:</b> {employee.email}</p>
      <p><b>Contact:</b> {employee.contact}</p>
      <p><b>Department:</b> {employee.department}</p>
      <p><b>Role:</b> {employee.role}</p>
      <p><b>Joining Date:</b> {employee.joiningDate}</p>
      <p><b>Status:</b> {employee.status}</p>
    </div>
  );
}
