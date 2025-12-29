"use client";

import { useEffect, useRef, useState } from "react";
import { Employee } from "@/types/employee";
import { fetchEmployees } from "@/lib/employeeService";
import Status from "@/components/Status";
import SearchFilter from "@/components/SearchFilter";
import Filters from "@/components/Filter";
import Link from "next/link";
import { deleteEmployee } from "@/services/employeeApi";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination";





export default function EmployeeTable() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;


  const menuRef = useRef<HTMLTableCellElement | null>(null);

  useEffect(() => {
    fetchEmployees()
      .then(setEmployees)
      .catch(console.error);
  }, []);
  useEffect(() => {
    setCurrentPage(1);
  }, [search, department, role, status]);


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

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

      <Table>
  <TableHeader>
    <TableRow>
      <TableHead className="text-center">Employee ID</TableHead>
      <TableHead className="text-center">Name</TableHead>
      <TableHead className="text-center">Department</TableHead>
      <TableHead className="text-center">Role</TableHead>
      <TableHead className="text-center">Status</TableHead>
      <TableHead className="text-center">Actions</TableHead>
    </TableRow>
  </TableHeader>

  <TableBody>
    {paginatedEmployees.length ? (
      paginatedEmployees.map((emp) => (
        <TableRow key={emp._id}>
          <TableCell className="text-center">
            <Link
              href={`/employees/${emp._id}`}
              className="text-blue-600 underline"
            >
              {emp.employeeId}
            </Link>
          </TableCell>

          <TableCell className="text-center">{emp.name}</TableCell>
          <TableCell className="text-center">{emp.department}</TableCell>
          <TableCell className="text-center">{emp.role}</TableCell>

          <TableCell className="text-center">
            <Status status={emp.status} />
          </TableCell>

          <TableCell className="text-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/employees/edit/${emp._id}`}>
                    Edit
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => handleDelete(emp._id)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      ))
    ) : (
      <TableRow>
        <TableCell
          colSpan={6}
          className="text-center py-6 text-gray-500"
        >
          No employees found
        </TableCell>
      </TableRow>
    )}
  </TableBody>
</Table>

      {totalPages > 1 && (
  <Pagination className="mt-6">
    <PaginationContent>

      <PaginationItem>
        <PaginationPrevious
          onClick={() =>
            setCurrentPage((p) => Math.max(p - 1, 1))
          }
          aria-disabled={currentPage === 1}
        />
      </PaginationItem>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
        (page) => (
          <PaginationItem key={page}>
            <PaginationLink
              isActive={currentPage === page}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        )
      )}

      <PaginationItem>
        <PaginationNext
          onClick={() =>
            setCurrentPage((p) =>
              Math.min(p + 1, totalPages)
            )
          }
          aria-disabled={currentPage === totalPages}
        />
      </PaginationItem>

    </PaginationContent>
  </Pagination>
)}


    </div>
  );
}
