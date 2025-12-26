"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

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
    if (!id) return;

    async function fetchEmployee() {
      try {
        setLoading(true);
        const res = await fetch(`/api/employees/${id}`);
        if (!res.ok) throw new Error("Failed to fetch employee");

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
      } catch (err) {
        console.error(err);
        toast.error("Failed to load employee data");
      } finally {
        setLoading(false);
      }
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
    try {
      setLoading(true);
      const res = await fetch(`/api/employees/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Update failed");

      toast.success("Employee updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update employee");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-lg font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <Toaster position="top-center" />
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

        <button type="submit" disabled={loading} className="bg-blue-600 text-white p-2 w-full disabled:opacity-50">
          {loading ? "Updating..." : "Update Employee"}
        </button>
      </form>
    </div>
  );
}
