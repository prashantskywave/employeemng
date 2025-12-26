"use client";

import { useEffect, useState } from "react";
import { Employee } from "@/types/employee";
import { fetchEmployees } from "@/lib/employeeService";
import Status from "@/components/Status";
import SearchFilter from "@/components/SearchFilter";
import Filters from "@/components/Filter";
import Link from "next/link";
import { deleteEmployee } from "@/services/employeeApi";
import { BsThreeDotsVertical } from "react-icons/bs";

export default function EmployeeTable() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");

  // 👉 three dot menu state
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

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
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border text-center">Employee ID</th>
            <th className="p-2 border text-center">Name</th>
            <th className="p-2 border text-center">Department</th>
            <th className="p-2 border text-center">Role</th>
            <th className="p-2 border text-center">Status</th>
            <th className="p-2 border text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredEmployees.length ? (
            filteredEmployees.map((emp) => (
              <tr key={emp._id}>
                <td className="p-2 border text-center">
                  <Link
                    href={`/employees/${emp._id}`}
                    className="text-blue-600"
                  >
                    {emp.employeeId}
                  </Link>
                </td>

                <td className="p-2 border text-center">{emp.name}</td>
                <td className="p-2 border text-center">{emp.department}</td>
                <td className="p-2 border text-center">{emp.role}</td>

                <td className="p-2 border text-center">
                  <Status status={emp.status} />
                </td>

                {/* ✅ THREE DOT ACTION MENU */}
                <td className="p-2 border text-center relative">
                  <button
                    onClick={() =>
                      setOpenMenuId(
                        openMenuId === emp._id ? null : emp._id
                      )
                    }
                    className="p-1"
                  >
                    <BsThreeDotsVertical />
                  </button>

                  {openMenuId === emp._id && (
                    <div className="absolute right-6 top-8 bg-white border rounded shadow-md z-10">
                      <Link
                        href={`/employees/edit/${emp._id}`}
                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                        onClick={() => setOpenMenuId(null)}
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => {
                          setOpenMenuId(null);
                          handleDelete(emp._id);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={6}
                className="p-4 text-center text-gray-500"
              >
                No employees found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
