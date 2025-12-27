"use client";

import { useEffect, useRef, useState } from "react";
import { Employee } from "@/types/employee";
import { fetchEmployees } from "@/lib/employeeService";
import Status from "@/components/Status";
import SearchFilter from "@/components/SearchFilter";
import Filters from "@/components/Filter";
import Link from "next/link";
import { deleteEmployee } from "@/services/employeeApi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";

export default function EmployeeTable() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const menuRef = useRef<HTMLTableCellElement | null>(null);

  useEffect(() => {
    fetchEmployees()
      .then(setEmployees)
      .catch(console.error);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = (id: string) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <span>Are you sure you want to delete this employee?</span>
          <div className="flex justify-end gap-2">
            <button
              className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
            <button
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              onClick={async () => {
                try {
                  await deleteEmployee(id);
                  setEmployees((prev) =>
                    prev.filter((emp) => emp._id !== id)
                  );
                  toast.success("Employee deleted successfully");
                } catch {
                  toast.error("Failed to delete employee");
                } finally {
                  toast.dismiss(t.id);
                }
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
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
      <Toaster position="top-center" reverseOrder={false} />

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
                  <Link href={`/employees/${emp._id}`} className="text-blue-600">
                    {emp.employeeId}
                  </Link>
                </td>
                <td className="p-2 border text-center">{emp.name}</td>
                <td className="p-2 border text-center">{emp.department}</td>
                <td className="p-2 border text-center">{emp.role}</td>
                <td className="p-2 border text-center">
                  <Status status={emp.status} />
                </td>

                <td className="p-2 border text-center">
                  <div className="flex justify-center gap-3">
                    <Link
                      href={`/employees/edit/${emp._id}`}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <FiEdit />
                    </Link>

                    <button
                      onClick={() => handleDelete(emp._id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="p-4 text-center text-gray-500">
                No employees found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
