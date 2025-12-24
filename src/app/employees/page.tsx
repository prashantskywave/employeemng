import EmployeeTable from "@/components/EmployeeTable";

export default function EmployeesPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Employee Management</h1>
      <EmployeeTable />
    </div>
  );
}
