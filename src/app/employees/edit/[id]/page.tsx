"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditEmployeePage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { id } = params;

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
      const res = await fetch(`/api/employees/${id}`);
      const data = await res.json();

      setForm({
        employeeId: data.employeeId || "",
        name: data.name || "",
        email: data.email || "",
        contact: data.contact || "",
        department: data.department || "",
        role: data.role || "",
        joiningDate: data.joiningDate || "",
        status: data.status || "Active",
      });

      setLoading(false);
    }

    fetchEmployee();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`/api/employees/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Employee updated successfully");
      router.push("/");
    } else {
      alert("Failed to update employee");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Edit Employee</h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="employeeId" value={form.employeeId} onChange={handleChange} className="border p-2 w-full" />
        <input name="name" value={form.name} onChange={handleChange} className="border p-2 w-full" />
        <input name="email" value={form.email} onChange={handleChange} className="border p-2 w-full" />
        <input name="contact" value={form.contact} onChange={handleChange} className="border p-2 w-full" />
        <input name="department" value={form.department} onChange={handleChange} className="border p-2 w-full" />
        <input name="role" value={form.role} onChange={handleChange} className="border p-2 w-full" />
        <input type="date" name="joiningDate" value={form.joiningDate} onChange={handleChange} className="border p-2 w-full" />

        <select name="status" value={form.status} onChange={handleChange} className="border p-2 w-full">
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <button className="bg-green-600 text-white px-4 py-2 w-full">
          Update Employee
        </button>
      </form>
    </div>
  );
}
