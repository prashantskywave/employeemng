"use client";

import { useEffect, useState } from "react";
import { Employee } from "@/types/employee";
import { fetchEmployees } from "@/lib/employeeService";
import Status from "@/components/Status";
import SearchFilter from "@/components/SearchFilter";
import Filters from "@/components/Filter";
import Link from "next/link";
import { deleteEmployee } from "@/services/employeeApi";


export default function EmployeeTable() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    fetchEmployees()
      .then(setEmployees)
      .catch(console.error);
  }, []);

    const handleDelete = async (id: string) => {
    const confirmed = confirm("Are you sure you want to delete this employee?");
    if (!confirmed) return;

    try {
      await deleteEmployee(id);
      setEmployees((prev) => prev.filter((emp) => emp._id !== id));
    } catch (error) {
      alert("Failed to delete employee");
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchSearch =
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.employeeId.includes(search);

    return (
      matchSearch &&
      (department === "all" || emp.department === department) &&
      (role === "all" || emp.role === role) &&
      (status === "all" || emp.status === status)
    );
  });

  return (
    <div className="space-y-4">
      <SearchFilter onSearch={setSearch} />
      <Filters
        department={department}
        role={role}
        status={status}
        setDepartment={setDepartment}
        setRole={setRole}
        setStatus={setStatus}
      />

      <table className="w-full border rounded-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Employee ID</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Department</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.length ? (
            filteredEmployees.map((emp) => (
              <tr key={emp._id}>
                <td className="p-2 border">
                  <Link href={`/employees/${emp._id}`} className="text-blue-600">
                    {emp.employeeId}
                  </Link>
                </td>
                <td className="p-2 border">{emp.name}</td>
                <td className="p-2 border">{emp.department}</td>
                <td className="p-2 border">{emp.role}</td>
                <td className="p-2 border">
                  <Status status={emp.status} />
                </td>
                <td className="p-2 border">
                  <Link
                    href={`/employees/edit/${emp._id}`}
                    className="text-blue-600 underline mr-3"
                  >
                    Edit
                  </Link>
                   <button
                    onClick={() => handleDelete(emp._id)}
                    className="text-red-600 underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="p-4 text-center text-gray-500">
                No employees found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
