"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddEmployeePage() {
  const router = useRouter();

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/employees", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Employee added successfully");
      router.push("/"); // go back to list
    } else {
      alert("Failed to add employee");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Add Employee</h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="employeeId" placeholder="Employee ID" onChange={handleChange} className="border p-2 w-full" />
        <input name="name" placeholder="Name" onChange={handleChange} className="border p-2 w-full" />
        <input name="email" placeholder="Email" onChange={handleChange} className="border p-2 w-full" />
        <input name="contact" placeholder="Contact" onChange={handleChange} className="border p-2 w-full" />
        <input name="department" placeholder="Department" onChange={handleChange} className="border p-2 w-full" />
        <input name="role" placeholder="Role" onChange={handleChange} className="border p-2 w-full" />
        <input type="date" name="joiningDate" onChange={handleChange} className="border p-2 w-full" />

        <select name="status" onChange={handleChange} className="border p-2 w-full">
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <button className="bg-blue-600 text-white px-4 py-2 w-full">
          Add Employee
        </button>
      </form>
    </div>
  );
}
