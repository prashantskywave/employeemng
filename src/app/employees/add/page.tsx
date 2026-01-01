"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IoMdPersonAdd } from "react-icons/io";
import { formatEmployeeId } from "@/utils/formatEmployeeId";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import toast, { Toaster } from "react-hot-toast";

export default function AddEmployeePage() {
  const router = useRouter();

  const today = new Date().toISOString().split("T")[0];

  const initialForm = {
    name: "",
    email: "",
    contact: "",
    department: "",
    role: "",
    joiningDate: "",
    status: "",
  };

  const [form, setForm] = useState(initialForm);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleReset = () => {
    setForm(initialForm);
  };

  const capitalizeName = (name: string) => {
    return name
      .toLowerCase()
      .split(" ")
      .filter(Boolean)
      .map(
        (word) => word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" ");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formattedName = capitalizeName(form.name);
    const updatedForm = { ...form, name: formattedName };
    setForm(updatedForm);

    for (const [key, value] of Object.entries(updatedForm)) {
      if (!value.trim()) {
        toast.error(`Please fill the ${key} field`, {
          position: "top-center",
        });
        return;
      }
    }

    const nameRegex = /^([A-Z][a-z]+)(\s[A-Z][a-z]+)*$/;
    if (!nameRegex.test(formattedName)) {
      toast.error(
        "Name must contain only string and each word should start with a capital letter",
        { position: "top-center" }
      );
      return;
    }

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(updatedForm.email.trim())) {
      toast.error(
        "Email must include @ and only one dot after @",
        { position: "top-center" }
      );
      return;
    }

    const contactRegex = /^[0-9]{10}$/;
    if (!contactRegex.test(updatedForm.contact.trim())) {
      toast.error(
        "Contact must contain only 10 digits and only number consider",
        { position: "top-center" }
      );
      return;
    }

    try {
      const res = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedForm),
      });

      if (res.ok) {
        toast.success("Employee added successfully", {
          position: "top-center",
          style: { textAlign: "center" },
        });
        setForm(initialForm);
        router.push("/");
      } else {
        const data = await res.json();

        if (
          data?.error?.toLowerCase().includes("duplicate") ||
          data?.message?.toLowerCase().includes("already exists")
        ) {
          toast.error("Employee ID already exists", {
            position: "top-center",
            style: { textAlign: "center" },
          });
        } else {
          toast.error("Failed to add employee", {
            position: "top-center",
            style: { textAlign: "center" },
          });
        }
      }
    } catch {
      toast.error("Something went wrong", {
        position: "top-center",
        style: { textAlign: "center" },
      });
    }
  };

  const selectInputLike =
    "w-full border border-gray-300 rounded-md px-3 py-2 text-sm";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Toaster position="top-center" />

      <Card className="w-full max-w-2xl">
        <CardHeader className="text-right">
          <CardTitle className="text-2xl font-semibold flex items-center gap-3 justify-right">
            <IoMdPersonAdd className="text-xl" /> Add Employee
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
            />

            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />

            <Input
              name="contact"
              placeholder="Contact"
              value={form.contact}
              onChange={handleChange}
            />

            <Select
              value={form.department}
              onValueChange={(value) =>
                setForm({ ...form, department: value })
              }
            >
              <SelectTrigger className={selectInputLike}>
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Human Resources">
                  Human Resources
                </SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={form.role}
              onValueChange={(value) =>
                setForm({ ...form, role: value })
              }
            >
              <SelectTrigger className={selectInputLike}>
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Frontend Developer">
                  Frontend Developer
                </SelectItem>
                <SelectItem value="HR">HR</SelectItem>
                <SelectItem value="Accountant">Accountant</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="date"
              name="joiningDate"
              value={form.joiningDate}
              min={today}
              onChange={(e) =>
                setForm({ ...form, joiningDate: e.target.value })
              }
            />

            <Select
              value={form.status}
              onValueChange={(value) =>
                setForm({ ...form, status: value })
              }
            >
              <SelectTrigger className={selectInputLike}>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex justify-center gap-3 pt-6">
              <Button type="submit" size="sm">
                Add
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
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
