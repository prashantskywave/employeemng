"use client";

import { useEffect, useState } from "react";
import { Employee } from "@/types/employee";
import { fetchEmployees } from "@/lib/employeeService";
import Status from "@/components/Status";
import SearchFilter from "@/components/SearchFilter";
import Filters from "@/components/Filter";
import Link from "next/link";

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
