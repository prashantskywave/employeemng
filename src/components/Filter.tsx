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

  return (
    <div className="flex items-center gap-8 mb-4 flex-nowrap">
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium">Department</Label>
        <Select value={department} onValueChange={setDepartment}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Engineering">Engineering</SelectItem>
            <SelectItem value="Manager">Manager</SelectItem>
            <SelectItem value="Finance">Finance</SelectItem>
            <SelectItem value="Human Resources">Human Resources</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium">Role</Label>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Frontend Developer">
              Frontend Developer
            </SelectItem>
            <SelectItem value="HR">HR</SelectItem>
            <SelectItem value="Accountant">Accountant</SelectItem>
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
      </div>

      <Button
        variant="default"
        onClick={() => router.push("/employees/add")}
        className="h-8"
      >
        + Add Employee
      </Button>
    </div>
  );
}
