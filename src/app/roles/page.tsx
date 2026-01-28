"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const user = { role: "ADMIN" }; // or "SUPER_ADMIN"

export default function RolesPage() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", departmentId: "", _id: "" });

  if (!["ADMIN", "SUPER_ADMIN"].includes(user.role)) {
    return <p className="p-6 text-red-600">Access Denied</p>;
  }

  useEffect(() => {
    fetch("/api/departments")
      .then((res) => res.json())
      .then(setDepartments)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!form.departmentId) return setRoles([]);
    fetch(`/api/roles?departmentId=${form.departmentId}`)
      .then((res) => res.json())
      .then(setRoles)
      .catch(console.error);
  }, [form.departmentId]);

  const handleSubmit = async () => {
    if (!form.name || !form.departmentId) return;

    const method = form._id ? "PUT" : "POST";
    const body = form._id
      ? { _id: form._id, name: form.name, departmentId: form.departmentId }
      : { name: form.name, departmentId: form.departmentId };

    const res = await fetch("/api/roles", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (method === "POST") setRoles((prev) => [...prev, data]);
    if (method === "PUT")
      setRoles((prev) =>
        prev.map((r) => (r._id === data._id ? data : r))
      );

    setForm({ name: "", departmentId: form.departmentId, _id: "" });
  };

  const handleUpdate = (role: any) => {
    setForm({ name: role.name, departmentId: role.departmentId._id || role.departmentId, _id: role._id });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this role?")) return;

    await fetch(`/api/roles?id=${id}`, { method: "DELETE" });
    setRoles((prev) => prev.filter((r) => r._id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Roles Management</h1>

      <div className="flex items-center gap-2 mb-4">
        <Select
          value={form.departmentId}
          onValueChange={(value) =>
            setForm({ ...form, departmentId: value })
          }
        >
          <SelectTrigger className="w-52">
            <SelectValue placeholder="Select Department" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((d) => (
              <SelectItem key={d._id} value={d._id}>
                {d.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder="Role Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <Button
          onClick={handleSubmit}
          disabled={!form.name || !form.departmentId}
        >
          {form._id ? "Update Role" : "Add Role"}
        </Button>
      </div>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Role ID</th>
            <th className="p-2 border">Role Name</th>
            <th className="p-2 border">Department</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.length === 0 && (
            <tr>
              <td colSpan={4} className="p-2 text-center">
                No roles found for selected department.
              </td>
            </tr>
          )}
          {roles.map((r) => (
            <tr key={r._id}>
              <td className="p-2 border">{r.roleId}</td>
              <td className="p-2 border">{r.name}</td>
              <td className="p-2 border">
                {departments.find((d) => d._id === (r.departmentId._id || r.departmentId))?.name ||
                  "-"}
              </td>
              <td className="p-2 border flex gap-2">
                <Button size="sm" onClick={() => handleUpdate(r)}>
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(r._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
