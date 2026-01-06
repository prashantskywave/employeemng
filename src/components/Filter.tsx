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

  const handleRefresh = () => {
    setDepartment("all");
    setRole("all");
    setStatus("all");
    router.refresh();
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
              <SelectItem value="HumanResources">Human Resources</SelectItem>
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

      <Button
        variant="default"
        onClick={() => router.push("/employees/add")}
        className="h-8 bg-black text-white hover:bg-black/90"
      >
        + Add Employee
      </Button>
    </div>
  );
}
