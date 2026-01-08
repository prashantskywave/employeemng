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
import { useSession } from "next-auth/react";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";



export default function EmployeeTable() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: session } = useSession();

  const userDepartment = session?.user?.department;
  console.log("userDepartment", userDepartment)
  const canManageEmployee =
    userDepartment.toLowerCase() === "admin" || userDepartment.toLowerCase() === "humanresources";

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
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = (employeeId: string) => {
    let reason = "Select Reason";

    toast(
      (t) => (
        <div className="w-[320px] space-y-4">
          <div className="space-y-1 text-sm text-gray-700">
            <p className="font-medium">
            Are you sure you want to delete this employee?
          </p>
            <p className="text-gray-500">
              Select a reason before deleting.
            </p>
          </div>
          <Select defaultValue="Select Reason"
            onValueChange={(value) => (reason = value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select reason" />
            </SelectTrigger>

            <SelectContent
              side="bottom"
              sideOffset={6}
              className="z-[9999]">
              <SelectItem value="Select Reason">Select Reason</SelectItem>
              <SelectItem value="Terminate">Terminate</SelectItem>
              <SelectItem value="Resigned">Resigned</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </Button>

            <Button
              size="sm"
              disabled={
                reason !== "Terminate" && reason !== "Resigned"
              }
              className={`${reason === "Terminate" || reason === "Resigned"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-red-300 cursor-not-allowed"
                }`}
              onClick={async () => {
                if (reason !== "Terminate" &&
                  reason !== "Resigned") {
                  toast.error("Please select a reason");
                  return;
                }

                try {
                  await deleteEmployee(employeeId, reason);

                  setEmployees((prev) =>
                    prev.filter((emp) => emp.employeeId !== employeeId)
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
            </Button>
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

      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="space-y-4 pt-6">

          <SearchFilter onSearch={setSearch} />

          <Filters
            department={department}
            role={role}
            status={status}
            setDepartment={setDepartment}
            setRole={setRole}
            setStatus={setStatus}
          />

          <Table className="w-full border border-gray-300 border-collapse rounded-md">
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead className="p-2 border text-center">Employee ID</TableHead>
                <TableHead className="p-2 border text-center">Name</TableHead>
                <TableHead className="p-2 border text-center">Department</TableHead>
                <TableHead className="p-2 border text-center">Role</TableHead>
                <TableHead className="p-2 border text-center">Status</TableHead>
                <TableHead className="p-2 border text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedEmployees.length ? (
                paginatedEmployees.map((emp) => (
                <TableRow key={emp.employeeId}>
                  <TableCell className="text-center">
                      <Link
                        href={`/employees/${emp.employeeId}`}
                        className="text-blue-600 underline"
                      >
                      {emp.employeeId}
                    </Link>
                  </TableCell>

                    <TableCell className="text-center border border-gray-300">{emp.name}</TableCell>
                    <TableCell className="text-center border border-gray-300">{emp.department}</TableCell>
                    <TableCell className="text-center border border-gray-300">{emp.role}</TableCell>

                    <TableCell className="text-center border border-gray-300">
                    <Status status={emp.status} />
                  </TableCell>

                    <TableCell className="text-center border border-gray-300">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <div
                          onMouseEnter={() => {
                            if (!canManageEmployee) {
                              toast.dismiss("edit");
                              toast("No permission to edit employees", {
                                id: "edit",
                                icon: "⚠️",
                                duration: Infinity,
                              });
                            }
                          }}
                          onMouseLeave={() => toast.dismiss("edit")}
                        >
                          <DropdownMenuItem
                            disabled={!canManageEmployee}
                            asChild={canManageEmployee}
                            className={!canManageEmployee ? "opacity-50" : ""}
                          >
                            {canManageEmployee ? (
                              <Link
                                href={`/employees/edit/${emp.employeeId}`}
                                className="flex items-center gap-2"
                              >
                                <FiEdit />
                                Edit
                              </Link>
                            ) : (
                              <div className="flex items-center gap-2">
                                <FiEdit />
                                Edit
                              </div>
                            )}
                          </DropdownMenuItem>
                        </div>
                        <div
                          onMouseEnter={() => {
                            if (!canManageEmployee) {
                              toast.dismiss("delete");
                              toast("No permission to delete employees", {
                                id: "delete",
                                icon: "⚠️",
                                duration: Infinity,
                              });
                            }
                          }}
                          onMouseLeave={() => toast.dismiss("delete")}
                        >
                          <DropdownMenuItem
                            disabled={!canManageEmployee}
                            className={
                              canManageEmployee
                                ? "text-red-600"
                                : "text-red-400 cursor-not-allowed"
                            }
                            onClick={() =>
                              canManageEmployee &&
                              handleDelete(emp.employeeId)
                            }
                          >
                            <FiTrash2 className="h-4 w-4 text-red-600" />
                            Delete
                          </DropdownMenuItem>
                        </div>

                      </DropdownMenuContent>
                    </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className="hover:bg-muted/50">
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
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
        </CardContent>
      </Card>
    </div>
  );
}