"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { IoMdRefresh } from "react-icons/io";
import { useRouter } from "next/navigation";

type Role = {
  roleId: string;
  name: string;
};

type Department = {
  _id: string;
  departmentId: string;
  name: string;
  roles: Role[];
};

export default function DepartmentClient() {
  const router = useRouter();

  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDeptId, setSelectedDeptId] = useState<string | undefined>();
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | undefined>();
  const showRefresh = Boolean(selectedDeptId || selectedRole);

  // Fetch departments from API and ensure roles are arrays
  useEffect(() => {
    fetch("/api/departments")
      .then((res) => res.json())
      .then((data) => {
        const safeData = (data ?? []).map((dept: any) => ({
          ...dept,
          roles: Array.isArray(dept.roles)
            ? dept.roles.map((r: any) => ({ roleId: String(r.roleId), name: r.name }))
            : [],
        }));
        setDepartments(safeData);
      });
  }, []);

  // Update available roles when department changes
  useEffect(() => {
    const dept = departments.find((d) => d._id === selectedDeptId);
    if (dept) {
      setAvailableRoles(dept.roles ?? []);
      setSelectedRole(undefined);
    } else {
      setAvailableRoles([]);
      setSelectedRole(undefined);
    }
  }, [selectedDeptId, departments]);

  // Filter table based on selected department and role
  const filteredDepartments = departments.filter((dept) => {
  if (selectedDeptId && dept._id !== selectedDeptId) return false;
  if (
    selectedRole &&
    !dept.roles.some((role) => role.roleId === selectedRole.roleId)
  )
    return false;
  return true;
});


  // Refresh handler
  const handleRefresh = () => {
    setSelectedDeptId("");
    setSelectedRole(undefined);
    router.refresh();
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-6">Departments</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        {/* Department Select */}
        <Select
          value={selectedDeptId}
          onValueChange={(value) => setSelectedDeptId(value)}
        >
          <SelectTrigger className="w-[240px]">
            <SelectValue placeholder="Select Department" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((dept) => (
              <SelectItem key={dept._id} value={dept._id}>
                {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Role Select */}
        <Select
          value={selectedRole?.roleId}
          onValueChange={(roleId) => {
            const role = availableRoles.find((r) => r.roleId === roleId);
            setSelectedRole(role);
          }}
          disabled={!selectedDeptId}
        >
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Select Role" />
          </SelectTrigger>
          <SelectContent>
            {availableRoles.map((role) => (
              <SelectItem key={role.roleId} value={role.roleId}>
                {role.name}
              </SelectItem>
            ))}
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

      {/* Table */}
      <table className="w-full border rounded-md">
        <thead>
          <tr className="bg-muted">
            <th className="p-2 border">Dept ID</th>
            <th className="p-2 border">Department</th>
            <th className="p-2 border">Roles</th>
          </tr>
        </thead>
        <tbody>
          {filteredDepartments.length === 0 ? (
            <tr>
              <td colSpan={3} className="p-4 text-center text-muted-foreground">
                No data found
              </td>
            </tr>
          ) : (
            filteredDepartments.map((dept) => (
              <tr key={dept._id}>
                <td className="p-2 border">{dept.departmentId}</td>
                <td className="p-2 border">{dept.name}</td>
                <td className="p-2 border">
                  <Select
                    value={selectedRole?.roleId}
                    onValueChange={(roleId) => {
                      const role = dept.roles.find((r) => r.roleId === roleId);
                      setSelectedRole(role);
                    }}
                  >
                    <SelectTrigger className="w-[220px]">
                      <SelectValue placeholder="Role lists" />
                    </SelectTrigger>
                    <SelectContent>
                      {(dept.roles ?? []).map((role) => (
                        <SelectItem key={role.roleId} value={role.roleId}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {/* {dept.roles.map(role => ( <span key={role.name} className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-1 text-sm"> {role.name} </span> ))} */}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
