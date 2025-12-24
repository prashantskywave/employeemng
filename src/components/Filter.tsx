"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";

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
  return (
    <div className="flex gap-4 mb-4 flex-wrap">
      <Select value={department} onValueChange={setDepartment}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Department" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="Engineering">Engineering</SelectItem>
          <SelectItem value="HR">HR</SelectItem>
        </SelectContent>
      </Select>

      <Select value={role} onValueChange={setRole}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="Frontend Developer">Frontend Developer</SelectItem>
          <SelectItem value="HR Manager">HR Manager</SelectItem>
        </SelectContent>
      </Select>

      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="Active">Active</SelectItem>
          <SelectItem value="Inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
      <Link
  href="/employees/add"
  className="bg-green-600 text-white px-4 py-2 rounded"
>
  + Add Employee
</Link>
    </div>
  );
}
