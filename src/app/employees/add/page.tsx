
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IoMdPersonAdd } from "react-icons/io";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import toast, { Toaster } from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { departmentRoles } from "@/utils/departmentRoles";
import { useSession } from "next-auth/react";

export default function AddEmployeePage() {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];
  const { data: session } = useSession();

  const currentUserDept =
    session?.user?.department?.toLowerCase() ?? "";
  const initialForm = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    contact: "",
    department: "",
    role: "",
    joiningDate: "",
    status: "",
  };

  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const availableRoles =
    form.department && departmentRoles[form.department]
      ? departmentRoles[form.department]
      : [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const capitalizeName = (name: string) =>
    name
      .toLowerCase()
      .split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formattedName = capitalizeName(form.name);
    const updatedForm = { ...form, name: formattedName };
    //setForm(updatedForm);

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
        "Name must contain only letters and each word should start with a capital letter",
        { position: "top-center" }
      );
      return;
    }

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(updatedForm.email.trim())) {
      toast.error("Email must include @ and a valid domain", {
        position: "top-center",
      });
      return;
    }

    const password = updatedForm.password.replace(/\s/g, "");
    const confirmPassword = updatedForm.confirmPassword.replace(/\s/g, "");
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&#])[A-Za-z0-9@$!%*?&#]{8,}$/;

    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must be at least 8 characters and include 1 uppercase, 1 number, and 1 special character",
        { position: "top-center" }
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Password and Confirm Password do not match", {
        position: "top-center",
      });
      return;
    }

    const contactRegex = /^[0-9]{10}$/;
    if (!contactRegex.test(updatedForm.contact.trim())) {
      toast.error("Contact must be 10 digits", {
        position: "top-center",
      });
      return;
    }

    try {
      const { confirmPassword, ...payload } = updatedForm;
      payload.password = password;

      const res = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();

        if (data?.error?.includes("duplicate")) {
          toast.error("Email already exists", {
            position: "top-center",
            style: { textAlign: "center" },
          });
        } else {
          toast.error("Failed to add employee", {
            position: "top-center",
            style: { textAlign: "center" },
          });
        }
      } else {
        toast.success("Employee added successfully", {
          position: "top-center",
          style: { textAlign: "center" },
        });
        setForm(initialForm);
        router.push("/employees");

      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong", {
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
            <Input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
            <Input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>

            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>

            <Input name="contact" placeholder="Contact" value={form.contact} onChange={handleChange} />

            <Select
              value={form.department}
              onValueChange={(value) => setForm({ ...form, department: value, role: "" })}
            >
              <SelectTrigger className={selectInputLike}>
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HumanResources">Human Resources</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
                {currentUserDept.toLowerCase() === "super_admin" ? <SelectItem value="admin">Admin</SelectItem> : null}
              </SelectContent>
            </Select>

            <Select
              value={form.role}
              onValueChange={(value) => setForm({ ...form, role: value })}
              disabled={!form.department}
            >
              <SelectTrigger className={selectInputLike}>
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="date"
              name="joiningDate"
              min={today}
              value={form.joiningDate}
              onChange={(e) => setForm({ ...form, joiningDate: e.target.value })}
            />

            <Select
              value={form.status}
              onValueChange={(value) => setForm({ ...form, status: value })}
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
              <Button type="submit" size="sm">Add</Button>
              <Button type="button" variant="outline" size="sm" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
