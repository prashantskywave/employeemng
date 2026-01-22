"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaUserEdit } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
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

const inputClass = "h-9 text-sm px-3";
const selectInputLike = "h-9 w-full text-sm px-3";

export default function ProfileEditPage() {
    const router = useRouter();
    const { data: session, status, update } = useSession();
    const today = new Date().toISOString().split("T")[0];

    const [saving, setSaving] = useState(false);

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

    useEffect(() => {
        if (!session?.user) return;

        setForm({
            employeeId: session.user.employeeId || "",
            firstName: session.user.firstName || "",
            lastName: session.user.lastName || "",
            email: session.user.email || "",
            contact: session.user.contact || "",
            department: session.user.department || "",
            role: session.user.role || "",
            joiningDate: session.user.joiningDate?.split("T")[0] || "",
            status: session.user.status || "Active",
            profileImage: null,
            profileImageUrl: session.user.profileImage || "",
        });

        document.title = "HRMS | Profile | Edit";
    }, [session]);

    if (status === "loading") {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                Loading...
            </div>
        );
    }

    const availableRoles =
        form.department && departmentRoles[form.department]
            ? departmentRoles[form.department]
            : [];

    const capitalizeName = (value: string) =>
        value
            .toLowerCase()
            .split(" ")
            .filter(Boolean)
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const updatedForm = {
            ...form,
            firstName: capitalizeName(form.firstName),
            lastName: capitalizeName(form.lastName),
        };

        try {
            const formData = new FormData();

            Object.entries(updatedForm).forEach(([key, value]) => {
                if (key === "profileImage" && value) {
                    formData.append("profileImage", value);
                } else if (typeof value === "string") {
                    formData.append(key, value);
                }
            });

            const res = await fetch(
                `/api/employees/${form.employeeId}`,
                {
                    method: "PUT",
                    body: formData,
                }
            );

            if (!res.ok) throw new Error();

            const data = await res.json();

            await update({
                user: {
                    ...session?.user,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    contact: data.contact,
                    profileImage: data.profileImage,
                },
            });

            toast.success("Profile updated successfully");
            router.push("/profile");
        } catch {
            toast.error("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };
    const targetDept = form.department?.toLowerCase();

    const currentUserDept = session?.user?.department?.toLowerCase() ?? "";
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
                        Edit Profile
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
                                    readOnly
                                    disabled
                                    className={`${inputClass} bg-gray-100 cursor-not-allowed`}
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <Label className="text-sm text-gray-600">First Name</Label>
                                <Input
                                    name="firstName"
                                    value={form.firstName}
                                    onChange={(e) =>
                                        setForm({ ...form, firstName: e.target.value })
                                    }
                                    className={inputClass}
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <Label className="text-sm text-gray-600">Last Name</Label>
                                <Input
                                    name="lastName"
                                    value={form.lastName}
                                    onChange={(e) =>
                                        setForm({ ...form, lastName: e.target.value })
                                    }
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
                                    onChange={(e) =>
                                        setForm({ ...form, email: e.target.value })
                                    }
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
