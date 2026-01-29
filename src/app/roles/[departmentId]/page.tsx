"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Role = {
  _id: string;
  roleId?: string;
  name: string;
  departmentName?: string;
};

export default function DepartmentRolesPage() {
  const { departmentId } = useParams<{ departmentId: string }>();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/roles?departmentId=${departmentId}`, {
      cache: "no-store",
    })
      .then((res) => res.json())
      .then(setRoles)
      .finally(() => setLoading(false));
  }, [departmentId]);

  if (loading) return <p className="p-4">Loading roles...</p>;
  if (roles.length === 0) return <p className="p-4">No roles found</p>;

  return <RolesTable roles={roles} />;
}
function RolesTable({ roles }: { roles: any[] }) {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Roles</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Role ID</TableHead>
            <TableHead>Role Name</TableHead>
            {/* <TableHead>Department</TableHead> */}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {roles.map((role) => (
            <TableRow key={role._id}>
              <TableCell>{role.roleId || role._id}</TableCell>
              <TableCell>{role.name}</TableCell>
              {/* <TableCell>{role.departmentName || "-"}</TableCell> */}
              <TableCell className="text-right space-x-2">
                <Button size="sm" variant="outline">
                  Edit
                </Button>
                <Button size="sm" variant="destructive">
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
