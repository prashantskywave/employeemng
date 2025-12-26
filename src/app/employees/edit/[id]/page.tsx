"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { FaUserEdit } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

const inputClass = "h-9 text-sm leading-none px-3 placeholder:text-sm";
const selectInputLike = "h-9 w-full text-sm px-3";
const buttonInputLike = "h-9 text-sm px-3 rounded-md";

export default function EditEmployeePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);

  const [form, setForm] = useState({
    employeeId: "",
    name: "",
    email: "",
    contact: "",
    department: "",
    role: "",
    joiningDate: "",
    status: "Active",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEmployee() {
      try {
        const res = await fetch(`/api/employees/${id}`);
        const data = await res.json();

        setForm({
          employeeId: data.employeeId || "",
          name: data.name || "",
          email: data.email || "",
          contact: data.contact || "",
          department: data.department || "",
          role: data.role || "",
          joiningDate: data.joiningDate?.split("T")[0] || "",
          status: data.status || "Active",
        });
      } catch {
        toast.error("Failed to load employee");
      } finally {
        setLoading(false);
      }
    }

    fetchEmployee();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`/api/employees/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      toast.success("Employee updated successfully");
    } catch {
      toast.error("Update failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Toaster position="top-center" />

      <Card className="w-full max-w-3xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold flex items-center gap-3">
            <FaUserEdit className="text-gray-700" />
            Edit Employee
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <Label className="text-sm text-gray-600">Employee ID</Label>
                <Input
                  name="employeeId"
                  value={form.employeeId}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label className="text-sm text-gray-600">Name</Label>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <Label className="text-sm text-gray-600">Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label className="text-sm text-gray-600">Contact</Label>
                <Input
                  name="contact"
                  value={form.contact}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <Label className="text-sm text-gray-600">Department</Label>
                <Select
                  value={form.department}
                  onValueChange={(value) =>
                    setForm({ ...form, department: value })
                  }
                >
                  <SelectTrigger className={selectInputLike}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HR">Human Resources</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Sales">Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1">
                <Label className="text-sm text-gray-600">Role</Label>
                <Select
                  value={form.role}
                  onValueChange={(value) =>
                    setForm({ ...form, role: value })
                  }
                >
                  <SelectTrigger className={selectInputLike}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manager">Frontend Developer</SelectItem>
                    <SelectItem value="Team Lead">HR</SelectItem>
                    <SelectItem value="Developer">Accountant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <Label className="text-sm text-gray-600">Joining Date</Label>
                <Input
                  type="date"
                  name="joiningDate"
                  value={form.joiningDate}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label className="text-sm text-gray-600">Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(value) =>
                    setForm({ ...form, status: value })
                  }
                >
                  <SelectTrigger className={selectInputLike}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-4 pt-6 justify-center">
              <Button type="submit" className={`w-32 ${buttonInputLike}`}>
                Save
              </Button>

              <Button
                type="button"
                variant="outline"
                className={`w-32 ${buttonInputLike}`}
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}
