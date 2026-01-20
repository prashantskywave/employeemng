"use client"
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaUserEdit } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { formatEmployeeId } from "@/utils/formatEmployeeId";
import { departmentRoles } from "@/utils/departmentRoles";
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

export default function EditEmployeePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
   const { id } = use(params);

   useEffect(() => {
    document.title = "HRMS | Employees | Edit";
  }, []);
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    employeeId: "",
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    department: "",
    role: "",
    joiningDate: "",
    status: "Active",
    profileImage: null as File | null,
    profileImageUrl: "",

  });

  const { data: session } = useSession();

  const currentUserDept =
    session?.user?.department?.toLowerCase() ?? "";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    async function fetchEmployee() {
      try {
        const res = await fetch(`/api/employees/${id}`);
        if (!res.ok) throw new Error();
        const data = await res.json();

        setForm((prev) => ({
          ...prev,
          employeeId: data.employeeId || "",
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          contact: data.contact || "",
          department: data.department || "",
          role: data.role || "",
          joiningDate: data.joiningDate?.split("T")[0] || "",
          status: data.status || "Active",
          profileImageUrl: data.profileImage || "",

        }));
      } catch {
        toast.error("Failed to load employee");
      } finally {
        setLoading(false);
      }
    }

    fetchEmployee();
  }, [id]);

  const availableRoles =
    form.department && departmentRoles[form.department]
      ? departmentRoles[form.department]
      : [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === "employeeId") {
      setForm({ ...form, employeeId: formatEmployeeId(value) });
    } else if (name === "profileImage" && files) {
      setForm({ ...form, profileImage: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
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

    const formattedFirstName = capitalizeName(form.firstName);
    const formattedLastName = capitalizeName(form.lastName);

    const updatedForm = {
      ...form,
      firstName: formattedFirstName,
      lastName: formattedLastName,
    };

    //setForm(updatedForm);


    for (const [key, value] of Object.entries(updatedForm)) {
      if (key === "profileImage") continue;

      if (typeof value === "string") {
        if (value.trim() === "") {
          toast.error(`Please fill the ${key} field`, {
            position: "top-center",
          });
          setSaving(false);
          return;
        }
      }
    }

    const nameRegex = /^[A-Z][a-z]+$/;
    if (!nameRegex.test(formattedFirstName)) {
      toast.error("First Name must contain only string and each word should start with a capital letter",
        { position: "top-center" });
      return;
    }
    if (!nameRegex.test(formattedLastName)) {
      toast.error("Last Name must contain only string and each word should start with a capital letter",
        { position: "top-center" });
      return;
    }

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(updatedForm.email.trim())) {
      toast.error("Email must include @ and a valid domain", { position: "top-center" });
      return;
    }

    const contactRegex = /^[0-9]{10}$/;
    if (!contactRegex.test(updatedForm.contact.trim())) {
      toast.error("Contact must contain only 10 digits", { position: "top-center" });
      return;
    }

    try {
      const res = await fetch(`/api/employees/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedForm),
      });

      if (res.ok) {
        toast.success("Employee updated successfully", { position: "top-center" });
        setTimeout(() => {
          router.push("/employees");
        }, 1500);
      } else {
        const data = await res.json();

        if (
          data?.error?.toLowerCase().includes("duplicate") ||
          data?.message?.toLowerCase().includes("email")
        ) {
          toast.error("Email already exists. Please use another email.", {
            position: "top-center",
          });
        } else {
          toast.error("Update failed", {
            position: "top-center",
          });
        }
      }
    } catch {
      toast.error("Something went wrong", { position: "top-center" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const targetDept = form.department?.toLowerCase();

  const disableDeptAndRole =
    (currentUserDept === "admin" &&
      (targetDept === "admin" || targetDept === "super_admin")) ||

    (currentUserDept === "super_admin" && targetDept === "super_admin");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
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
                  disabled
                  className={`${inputClass} bg-gray-100 cursor-not-allowed`}
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label className="text-sm text-gray-600">First Name</Label>
                <Input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label className="text-sm text-gray-600">Last Name</Label>
                <Input
                  name="lastName"
                  value={form.lastName}
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
                  className={inputClass}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      contact: e.target.value.replace(/\D/g, ""),
                    })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <Label className="text-sm text-gray-600">Department</Label>
                {disableDeptAndRole ? (
                  <Input
                    value={form.department}
                    disabled
                    className="bg-gray-100 cursor-not-allowed h-9 text-sm"
                  />
                ) : (
                  <Select
                    value={form.department}
                    onValueChange={(value) =>
                      setForm({
                        ...form,
                        department: value,
                        role: "",
                      })
                    }
                  >
                    <SelectTrigger className={selectInputLike}>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="HumanResources">Human Resources</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                      {currentUserDept.toLowerCase() === "super_admin" ? <SelectItem value="admin">Admin</SelectItem> : null}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <Label className="text-sm text-gray-600">Role</Label>
                {disableDeptAndRole ? (
                  <Input
                    value={form.role}
                    disabled
                    className="bg-gray-100 cursor-not-allowed h-9 text-sm"
                  />
                ) : (
                  <Select
                    key={form.department}
                    value={form.role}
                    onValueChange={(value) =>
                      setForm({ ...form, role: value })
                    }
                    disabled={!availableRoles.length}
                  >
                    <SelectTrigger className={selectInputLike}>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>

                    <SelectContent>
                      {availableRoles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <Label className="text-sm text-gray-600">Joining Date</Label>
                <Input
                  type="date"
                  name="joiningDate"
                  value={form.joiningDate}
                  min={today}
                  onChange={handleChange}
                  disabled
                  className={`${inputClass} bg-gray-100 cursor-not-allowed`}
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
            <div className="flex flex-col gap-1">
              <Label className="text-sm text-gray-600">Profile Image</Label>

              <label className="h-24 w-24 rounded-full border overflow-hidden flex items-center justify-center cursor-pointer">
                {form.profileImage ? (
                  <img
                    src={URL.createObjectURL(form.profileImage)}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : form.profileImageUrl ? (
                  <img
                    src={form.profileImageUrl}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-sm text-gray-400">No Image</span>
                )}

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    setForm({ ...form, profileImage: e.target.files?.[0] || null })
                  }
                />
              </label>
            </div>


            <div className="flex gap-4 justify-center pt-4">
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </span>
                ) : (
                  "Save"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>

          </form>

        </CardContent>
      </Card>
    </div >
  );
}
