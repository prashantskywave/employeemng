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
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

type Role = {
  _id: string;
  roleId?: string;
  name: string;
  departmentId?: any;
  departmentName?: string;
};

export default function DepartmentRolesPage() {
  const { departmentId } = useParams<{ departmentId: string }>();
  const { data: session, status } = useSession();

  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  //Form state for Add / Update role
  const [form, setForm] = useState({
    _id: "",
    name: "",
    departmentId: departmentId || "",
  });

  useEffect(() => {
    if (departmentId) {
      setForm((prev) => ({
        ...prev,
        departmentId: departmentId as string,
      }));
    }
  }, [departmentId]);

  const userRole = session?.user?.role;
  const canManage =
    userRole === "admin" || userRole === "super_admin";

  // Access control
  const user = { role: "admin" };
  if (!["admin", "super_admin"].includes(user.role)) {
    return <p className="p-6 text-red-600">Access Denied</p>;
  }


  useEffect(() => {
    fetch(`/api/roles?departmentId=${departmentId}`, {
      cache: "no-store",
    })
      .then((res) => res.json())
      .then(setRoles)
      .finally(() => setLoading(false));
  }, [departmentId]);

  const handleUpdate = (role: Role) => {
    setForm({
      _id: role._id,
      name: role.name,
      departmentId:
        typeof role.departmentId === "object"
          ? role.departmentId._id
          : departmentId,
    });
  };

  const handleDelete = (_id: string) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="font-medium">
            Are you sure you want to delete this role?
          </p>
          <div className="flex justify-end gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={async () => {
                const res = await fetch(`/api/roles?id=${_id}`, {
                  method: "DELETE",
                });

                if (!res.ok) {
                  toast.error("Delete failed");
                } else {
                  toast.success("Role deleted");
                  setRoles((prev) =>
                    prev.filter((r) => r._id !== _id)
                  );
                }
                toast.dismiss(t.id);
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

  const handleSubmit = async () => {
    const method = form._id ? "PUT" : "POST";

    const res = await fetch("/api/roles", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: form._id,
        name: form.name,
        departmentId: form.departmentId,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error("Update failed:", err);
      toast.error(err.message || "Action failed");
      return;
    }

    toast.success(form._id ? "Role updated" : "Role added");
    setForm({ _id: "", name: "", departmentId });

    //referesh role list
    const updated = await fetch(
      `/api/roles?departmentId=${departmentId}`
    ).then((r) => r.json());
    setRoles(updated);
  };

  if (loading) return <p className="p-4">Loading roles...</p>;
  //if (roles.length === 0) return <p className="p-4">No roles found</p>;

  return (
    <div className="p-6 space-y-4">
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="space-y-4 pt-2 pb-6">
          <CardTitle className="text-xl font-medium mb-2">
            Roles {roles[0]?.departmentName && `- ${roles[0].departmentName}`}
          </CardTitle>

          {canManage && (
            <div className="flex gap-3 mb-4 max-w-md">
              <Input
                placeholder="Role Name"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
              />
              <Button onClick={handleSubmit} disabled={!form.name}>
                {form._id ? "Update Role" : "Add Role"}
              </Button>
            </div>
          )}
          <RolesTable
            roles={roles}
            canManage={canManage}
            onEdit={handleUpdate}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div >
  );
}
function RolesTable({
  roles,
  canManage,
  onEdit,
  onDelete,
}: {
  roles: Role[];
  canManage: boolean;
  onEdit: (role: Role) => void;
  onDelete: (_id: string) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <Table className="w-full border rounded-md">
        <TableHeader>
          <TableRow className="bg-muted">
            <TableHead className="p-2 border text-center w-[250px]">Role ID</TableHead>
            <TableHead className="p-2 border  w-[350px] text-center">Role Name</TableHead>
            {canManage && (
              <TableHead className="p-2 border text-center w-[250px]">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {roles.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="p-4 text-center text-muted-foreground">
                No roles found for selected department.
              </TableCell>
            </TableRow>
          )}
          {roles.map((role) => (
            <TableRow key={role._id}>
              <TableCell className="p-2 border text-center w-[250px]">
                {role.roleId || role._id}
              </TableCell>
              <TableCell className="p-2 border text-center w-[350px]">
                {role.name}
              </TableCell>

              {canManage && (
                <TableCell className="p-2 border w-[250px]">
                  <div className="flex justify-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(role)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onDelete(role._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
