"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { IoMdRefresh } from "react-icons/io";
import { departmentRoles } from "@/utils/departmentRoles";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

interface FiltersProps {
  department: string;
  role: string;
  status: string;
  setDepartment: (v: string) => void;
  setRole: (v: string) => void;
  setStatus: (v: string) => void;
}

export default function Filters({
  department,
  role,
  status,
  setDepartment,
  setRole,
  setStatus,
}: FiltersProps) {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  if (status === "loading") return null;
  const userDepartment = session?.user?.department ?? "";
  const isAdmin = userDepartment.toLowerCase() === "admin";

  const handleRefresh = () => {
    setDepartment("all");
    setRole("all");
    setStatus("all");
    router.refresh();
  };

  const handleAddEmployee = () => {
    if (!isAdmin) {
      toast.error(
        "HRs don’t have permission to add employees. Please contact Admin."
      );
      return;
    }
    router.push("/employees/add");
  };

  const allRoles = [
    "Frontend Developer",
    "Backend Developer",
    "HR",
    "Accountant",
    "Project Manager",
    "Team Lead",
  ];

  const availableRoles =
    department === "all"
      ? allRoles
      : departmentRoles[department] || [];


  const showRefresh = department !== "all" || role !== "all" || status !== "all";

  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-8 flex-nowrap">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">Department</Label>
          <Select
            value={department}
            onValueChange={(value) => {
              setDepartment(value);
              setRole("all");
            }}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Engineering">Engineering</SelectItem>
              <SelectItem value="Manager">Manager</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
              <SelectItem value="HumanResources">
                Human Resources
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">Role</Label>
          <Select
            key={department}
            value={role}
            onValueChange={setRole}
            disabled={department !== "all" && availableRoles.length === 0}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {availableRoles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>


        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          {showRefresh && (
            <Button
              variant="outline"
              onClick={handleRefresh}
              className="flex items-center gap-2"
            >
              Data Refresh
              <IoMdRefresh className="text-base" />
            </Button>
          )}
        </div>
      </div>

      <div
        onMouseEnter={() => {
          if (!isAdmin) {
            toast.dismiss("add-employee-permission");
            toast(
              "Don’t have permission to add employees. Please contact Admin.",
              {
                id: "add-employee-permission",
                icon: "⚠️",
                duration: Infinity,
              }
            );
          }
        }}
        onMouseLeave={() => {
          toast.dismiss("add-employee-permission");
        }}
      >
        <Button
          onClick={handleAddEmployee}
          disabled={!isAdmin}
          className={`h-8 text-white ${isAdmin
              ? "bg-black hover:bg-black/90"
              : "bg-gray-400 cursor-not-allowed"
            }`}
        >
          + Add Employee
        </Button>
      </div>

    </div>
  );
}
