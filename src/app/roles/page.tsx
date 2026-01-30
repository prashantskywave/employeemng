"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IoMdRefresh } from "react-icons/io";
import { Card, CardContent, CardTitle } from "@/components/ui/card";


type Role = {
  _id: string;
  roleId?: string;
  name: string;
  departmentId?: string | { _id: string } | null;
  departmentName?: string;
};

export default function RolesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  const [departments, setDepartments] = useState<
    { _id: string; name: string }[]
  >([]);

  const [filterDept, setFilterDept] = useState<string>("all");

  useEffect(() => {
    fetch("/api/departments", { cache: "no-store" })
      .then((res) => res.json())
      .then(setDepartments)
      .catch(() => toast.error("Failed to load departments"));
  }, []);


  //Form state for Add / Update role
  const [form, setForm] = useState({
    _id: "",
    name: "",
    departmentId: "",
  });

  const handleRefresh = () => {
    setFilterDept("all");
    router.refresh();
  };
  const showRefresh = filterDept !== "all";


  const userRole = session?.user?.role;
  const canManage =
    userRole === "admin" || userRole === "super_admin";

  // Access control
  const user = { role: "admin" };
  if (!["admin", "super_admin"].includes(user.role)) {
    return <p className="p-6 text-red-600">Access Denied</p>;
  }

  // Fetch all roles
  useEffect(() => {
    fetch("/api/roles", { cache: "no-store" })
      .then((res) => res.json())
      .then(setRoles)
      .catch(() => toast.error("Failed to load roles"))
      .finally(() => setLoading(false));
  }, []);


  const handleUpdate = (role: Role) => {
    setForm({
      _id: role._id,
      name: role.name,
      departmentId:
        typeof role.departmentId === "object"
          ? role.departmentId._id
          : role.departmentId ?? "",
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
    console.log("UPDATE PAYLOAD", {
      id: form._id,
      name: form.name,
      departmentId: form.departmentId,
    });

    const isUpdate = Boolean(form._id);

    const res = await fetch("/api/roles", {
      method: isUpdate ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: form._id || undefined,
        name: form.name,
        departmentId: form.departmentId || null,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error("Update failed:", err);
      toast.error(err.message || "Action failed");
      return;
    }

    toast.success(isUpdate ? "Role updated" : "Role added");
    setForm({ _id: "", name: "", departmentId: "" });

    //referesh role list
    const updated = await fetch("/api/roles", { cache: "no-store" }).then((r) => r.json());
    setRoles(updated);
  };

  const filteredRoles =
    filterDept === "all"
      ? roles
      : roles.filter((role) => {
        if (typeof role.departmentId === "object" && role.departmentId?._id) {
          return role.departmentId._id === filterDept;
        }

        if (typeof role.departmentId === "string") {
          return role.departmentId === filterDept;
        }

        const dept = departments.find((d) => d._id === filterDept);
        return dept ? role.departmentName === dept.name : false;
      });



  if (loading) return <p className="p-4">Loading roles...</p>;
  if (roles.length === 0) return <p className="p-4">No roles found</p>;

  return (
    <div className="p-6">
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="space-y-4 pt-2 pb-6">
          <CardTitle className="text-xl font-medium mb-2">Roles</CardTitle>

          <div className="flex flex-nowrap gap-3 mb-4 items-center">
            {/* Filter (ALL users) */}
            <Select value={filterDept} onValueChange={setFilterDept}>
              <SelectTrigger className="w-52">
                <SelectValue placeholder="Filter by Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((d) => (
                  <SelectItem key={d._id} value={d._id}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {canManage && (
          <>
            <Input
              className="w-80 flex-shrink-0"
              placeholder="Role Name"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
            />
            <Button onClick={handleSubmit} disabled={!form.name}>
              {form._id ? "Update Role" : "Add Role"}
            </Button>
          </>
        )}

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
          <div className="overflow-x-auto">
            <Table className="w-full border rounded-md">
              <TableHeader>
                <TableRow className="bg-muted">
                  <TableHead className="p-2 border text-center w-[200px]">
                    Role ID
                  </TableHead>
                  <TableHead className="p-2 border text-center w-[300px]">
                    Role Name
                  </TableHead>
                  <TableHead className="p-2 border w-[300px] text-center">
                    Department
                  </TableHead>
                  {canManage && (
                    <TableHead className="p-2 border text-center w-[250px]">
                      Actions
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredRoles.map((role) => (
                  <TableRow key={role._id}>
                    <TableCell className="p-2 border text-center  w-[200px]">
                      {role.roleId || role._id}
                    </TableCell>

                    <TableCell className="p-2 border text-center w-[300px]">
                      {role.name}
                    </TableCell>

                    <TableCell className="p-2 border text-center w-[300px]">
                      {role.departmentName || "-"}
                    </TableCell>

                    {canManage && (
                      <TableCell className="p-2 border w-[250px]">
                        <div className="flex justify-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdate(role)}
                          >
                            Edit
                          </Button>

                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(role._id)}
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
        </CardContent>
      </Card>
    </div>
  );
}
