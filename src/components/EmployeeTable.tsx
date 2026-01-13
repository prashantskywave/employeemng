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
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { ChevronDown } from "lucide-react";
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
import { canEditEmployee } from "@/lib/permission";


export default function EmployeeTable() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: session, status: sessionStatus } = useSession();
  if (status === "loading") return null;
  const userDepartment = session?.user?.department?.toLowerCase() ?? "";

  const canManageEmployee =
    userDepartment === "admin" || userDepartment === "humanresources" || userDepartment === "super_admin";

  const [itemsPerPage, setItemsPerPage] = useState(5);

  const menuRef = useRef<HTMLTableCellElement | null>(null);
  const MAX_VISIBLE_PAGES = 5;

  const getVisiblePages = () => {
    if (totalPages <= MAX_VISIBLE_PAGES) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(MAX_VISIBLE_PAGES / 2);
    let start = Math.max(currentPage - half, 1);
    let end = start + MAX_VISIBLE_PAGES - 1;

    if (end > totalPages) {
      end = totalPages;
      start = end - MAX_VISIBLE_PAGES + 1;
    }

    return Array.from(
      { length: end - start + 1 },
      (_, i) => start + i
    );
  };

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
        // setOpenMenuId(null);
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
      `${emp.firstName ?? ""} ${emp.lastName ?? ""} ${emp.employeeId}`
        .toLowerCase()
        .includes(search.toLowerCase());

    return (
      matchSearch &&
      (department === "all" || emp.department === department) &&
      (role === "all" || emp.role === role) &&
      (status === "all" || emp.status === status)
    );
  });

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [itemsPerPage, filteredEmployees.length, totalPages, currentPage]);

  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4">

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
          <div className="flex items-center gap-4 text-sm">
            <span className="font-medium">Show:</span>

            <div className="flex justify-end">
              <div className="flex items-center gap-2 text-sm">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1 px-3"
                    >
                      {itemsPerPage}
                      <ChevronDown className="h-4 w-4 opacity-60" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-36">
                    {[5, 10, 20, 40, 80, 100].map((count) => (
                      <DropdownMenuItem
                        key={count}
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => {
                          setItemsPerPage(count);
                          setCurrentPage(1);
                        }}
                      >
                        <input
                          type="radio"
                          checked={itemsPerPage === count}
                          readOnly
                          className="accent-blue-600"
                        />
                        <span>{count}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <span className="font-medium whitespace-nowrap">entries</span>
              </div>
            </div>


          </div>


          <Table className="w-full border border-gray-300 border-collapse rounded-md">
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead className="p-2 border text-center">Employee ID</TableHead>
                <TableHead className="p-2 border text-center">Name</TableHead>
                <TableHead className="p-2 border text-center">Department</TableHead>
                <TableHead className="p-2 border text-center">Role</TableHead>
                <TableHead className="p-2 border text-center">Status</TableHead>
                {canManageEmployee && (
                  <TableHead className="p-2 border text-center">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedEmployees.length ? (
                paginatedEmployees.map((emp) => {
                  const canEdit = canEditEmployee(
                    userDepartment,
                    emp.department
                  );
                  return (
                    <TableRow key={emp.employeeId}>
                      <TableCell className="text-center">
                        <Link
                          href={`/employees/${emp.employeeId}`}
                          className="text-blue-600 underline"
                          title={emp.email}
                        >
                          {emp.employeeId}
                        </Link>
                      </TableCell>

                      <TableCell className="text-center border border-gray-300">{[emp.firstName].filter(Boolean).join(" ")}</TableCell>
                      <TableCell className="text-center border border-gray-300">{emp.department}</TableCell>
                      <TableCell className="text-center border border-gray-300">{emp.role}</TableCell>

                      <TableCell className="text-center border border-gray-300">
                        <Status status={emp.status} />
                      </TableCell>

                      {canManageEmployee && (
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
                                  if (!canEdit) {
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
                                  disabled={!canEdit}
                                  asChild={canEdit}
                                  className={!canEdit ? "opacity-50" : ""}
                                >
                                  {canEdit ? (
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
                                  if (!canEdit) {
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
                                  disabled={!canEdit}
                                  className={
                                    canEdit
                                      ? "text-red-600"
                                      : "text-red-400 cursor-not-allowed"
                                  }
                                  onClick={() =>
                                    canEdit &&
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
                      )}
                    </TableRow>
                  )
                })
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
                    onClick={() => {
                      if (currentPage > 1) {
                        setCurrentPage((p) => Math.max(p - 1, 1));
                      }
                    }}
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>

                {currentPage > 3 && (
                  <PaginationItem>
                    <span className="px-2 text-muted-foreground">…</span>
                  </PaginationItem>
                )}

                {getVisiblePages().map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={currentPage === page}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                {currentPage < totalPages - 2 && (
                  <PaginationItem>
                    <span className="px-2 text-muted-foreground">…</span>
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => {
                      if (currentPage < totalPages) {
                        setCurrentPage((p) => Math.min(p + 1, totalPages));
                      }
                    }}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>
    </div >
  );
}