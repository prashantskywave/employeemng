
// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { IoMdPersonAdd } from "react-icons/io";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";
// import toast, { Toaster } from "react-hot-toast";
// import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
// import { departmentRoles } from "@/utils/departmentRoles";
// import { useSession } from "next-auth/react";
// import { Loader2 } from "lucide-react";

// export default function AddEmployeePage() {
//   const router = useRouter();
//   const today = new Date().toISOString().split("T")[0];
//   const { data: session } = useSession();

//   const currentUserDept =
//     session?.user?.department?.toLowerCase() ?? "";
//   const initialForm = {
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     contact: "",
//     department: "",
//     role: "",
//     joiningDate: "",
//     status: "",
//     profileImage: null as File | null,
//   };

//   const [form, setForm] = useState(initialForm);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [saving, setSaving] = useState(false);


//   const availableRoles =
//     form.department && departmentRoles[form.department]
//       ? departmentRoles[form.department]
//       : [];

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setForm({ ...form, [name]: value });
//   };
//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setForm({ ...form, profileImage: e.target.files[0] });
//     }
//   };
//   const capitalizeName = (name: string) =>
//     name
//       .toLowerCase()
//       .split(" ")
//       .filter(Boolean)
//       .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(" ");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSaving(true);


//     const formattedFirstName = capitalizeName(form.firstName);
//     const formattedLastName = capitalizeName(form.lastName);
//     const updatedForm = {
//       ...form,
//       firstName: formattedFirstName,
//       lastName: formattedLastName,
//     };
//     //setForm(updatedForm);

//     await new Promise((resolve) => setTimeout(resolve, 3000));
//     const formattedName = capitalizeName(form.name);
//     const updatedForm = { ...form, name: formattedName };
//     setForm(updatedForm);

//     for (const [key, value] of Object.entries(updatedForm)) {
//       if (key === "profileImage") continue;
//       if (typeof value === "string" && !value.trim()) {
//         toast.error(`Please fill the ${key} field`, { position: "top-center" });
//         setSaving(false);
//         return;
//       }
//     }

//     const singleNameRegex = /^[A-Z][a-z]+$/;
//     if (!singleNameRegex.test(formattedFirstName)) {
//       toast.error("Invalid first name");
//       return;
//     }

//     if (!singleNameRegex.test(formattedLastName)) {
//       toast.error("Invalid last name");
//     const nameRegex = /^([A-Z][a-z]+)(\s[A-Z][a-z]+)*$/;
//     if (!nameRegex.test(formattedName)) {
//       toast.error(
//         "Name must contain only letters and each word should start with a capital letter",
//         { position: "top-center" }
//       );
//       setSaving(false);
//       return;
//     }

//     const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.[A-Za-z]{2,}$/;
//     if (!emailRegex.test(updatedForm.email.trim())) {
//       toast.error("Email must include @ and a valid domain", {
//         position: "top-center",
//       });
//       setSaving(false);
//       return;
//     }

//     const password = updatedForm.password.replace(/\s/g, "");
//     const confirmPassword = updatedForm.confirmPassword.replace(/\s/g, "");
//     const passwordRegex =
//       /^(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&#])[A-Za-z0-9@$!%*?&#]{8,}$/;

//     if (!passwordRegex.test(password)) {
//       toast.error(
//         "Password must be at least 8 characters and include 1 uppercase, 1 number, and 1 special character",
//         { position: "top-center" }
//       );
//       setSaving(false);
//       return;
//     }

//     if (password !== confirmPassword) {
//       toast.error("Password and Confirm Password do not match", {
//         position: "top-center",
//       });
//       setSaving(false);
//       return;
//     }

//     const contactRegex = /^[0-9]{10}$/;
//     if (!contactRegex.test(updatedForm.contact.trim())) {
//       toast.error("Contact must be 10 digits", {
//         position: "top-center",
//       });
//       setSaving(false);

//       return;
//     }

//     try {
//       const formData = new FormData();
//       const { confirmPassword, ...payload } = updatedForm;
//       payload.password = password;
//       for (const [key, value] of Object.entries(payload)) {
//         if (key === "profileImage" && value instanceof File) {
//           formData.append(key, value);
//         } else {
//           formData.append(key, value as string);
//         }
//       }
//       const res = await fetch("/api/employees", {
//         method: "POST",
//         body: formData,
//       });

//       if (!res.ok) {
//         const data = await res.json();

//         const errorMessage =
//           data?.error || data?.message || "";

//         if (
//           errorMessage.toLowerCase().includes("duplicate") ||
//           errorMessage.toLowerCase().includes("exists")
//         ) {
//           toast.error("Email already exists", {
//             position: "top-center",
//             style: { textAlign: "center" },
//             duration: 2000,
//           });
//         } else {
//           toast.error("Failed to add employee", {
//             position: "top-center",
//             style: { textAlign: "center" },
//             duration: 2000,
//           });
//         }
//       } else {
//         toast.success("Employee added successfully", {
//           position: "top-center",
//           style: { textAlign: "center" },
//           duration: 2000,
//         });
//         setForm(initialForm);
//         router.push("/employees");

//       }
//     } catch (error: any) {
//       toast.error(error.message || "Something went wrong", {
//         position: "top-center",
//         style: { textAlign: "center" },
//         duration: 2000,
//       });
//     }
//   };

//   const selectInputLike =
//     "w-full border border-gray-300 rounded-md px-3 py-2 text-sm";

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
//       <Toaster position="top-center" />

//       <Card className="w-full max-w-2xl">
//         <CardHeader className="text-right">
//           <CardTitle className="text-2xl font-semibold flex items-center gap-3 justify-right">
//             <IoMdPersonAdd className="text-xl" /> Add Employee
//           </CardTitle>
//         </CardHeader>

//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <Input
//               name="firstName"
//               placeholder="First Name"
//               value={form.firstName}
//               onChange={handleChange}
//             />

//             <Input
//               name="lastName"
//               placeholder="Last Name"
//               value={form.lastName}
//               onChange={handleChange}
//             />
//             <Input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />

//             <div className="relative">
//               <Input
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 placeholder="Password"
//                 value={form.password}
//                 onChange={handleChange}
//                 className="pr-10"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2"
//               >
//                 {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
//               </button>
//             </div>

//             <div className="relative">
//               <Input
//                 type={showConfirmPassword ? "text" : "password"}
//                 name="confirmPassword"
//                 placeholder="Confirm Password"
//                 value={form.confirmPassword}
//                 onChange={handleChange}
//                 className="pr-10"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2"
//               >
//                 {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
//               </button>
//             </div>

//             <Input
//               name="contact"
//               placeholder="Contact"
//               inputMode="numeric"
//               pattern="[0-9]*"
//               value={form.contact}
//               onChange={handleChange}
//             />

//             <Select
//               value={form.department}
//               onValueChange={(value) => setForm({ ...form, department: value, role: "" })}
//             >
//               <SelectTrigger className={selectInputLike}>
//                 <SelectValue placeholder="Department" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="HumanResources">Human Resources</SelectItem>
//                 <SelectItem value="Finance">Finance</SelectItem>
//                 <SelectItem value="Engineering">Engineering</SelectItem>
//                 <SelectItem value="Manager">Manager</SelectItem>
//                 {currentUserDept.toLowerCase() === "super_admin" ? <SelectItem value="admin">Admin</SelectItem> : null}
//               </SelectContent>
//             </Select>

//             <Select
//               value={form.role}
//               onValueChange={(value) => setForm({ ...form, role: value })}
//               disabled={!form.department}
//             >
//               <SelectTrigger className={selectInputLike}>
//                 <SelectValue placeholder="Role" />
//               </SelectTrigger>
//               <SelectContent>
//                 {availableRoles.map((role) => (
//                   <SelectItem key={role} value={role}>
//                     {role}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>

//             <Input
//               type="date"
//               name="joiningDate"
//               min={today}
//               value={form.joiningDate}
//               onChange={(e) => setForm({ ...form, joiningDate: e.target.value })}
//             />

//             <Select
//               value={form.status}
//               onValueChange={(value) => setForm({ ...form, status: value })}
//             >
//               <SelectTrigger className={selectInputLike}>
//                 <SelectValue placeholder="Status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="Active">Active</SelectItem>
//                 <SelectItem value="Inactive">Inactive</SelectItem>
//               </SelectContent>
//             </Select>
//             <div className="flex flex-col items-start">
//               <label className="relative block w-full">
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleImageChange}
//                   className="absolute inset-0 opacity-0 cursor-pointer"
//                 />

//                 <div className="h-9 w-full px-3 pr-10 border border-input rounded-md bg-white text-sm text-muted-foreground flex items-center">
//                   Choose File
//                 </div>

//                 <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
//                   <svg
//                     className="h-4 w-4 text-gray-400"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     viewBox="0 0 24 24"
//                   >
//                     <path d="M6 9l6 6 6-6" />
//                   </svg>
//                 </div>
//               </label>

//               {form.profileImage ? (
//                 <p className="text-sm text-gray-700">
//                   Selected file: {form.profileImage.name}
//                 </p>
//               ) : (
//                 <p className="text-sm text-gray-400"></p>
//               )}
//             </div>
//             <div className="flex justify-center gap-3 pt-6">
//               <Button type="submit" size="sm" disabled={saving}>
//                 {saving ? (
//                   <span className="flex items-center gap-2">
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                     Adding...
//                   </span>
//                 ) : (
//                   "Add"
//                 )}
//               </Button>

//               <Button
//                 type="button"
//                 variant="outline"
//                 size="sm"
//                 onClick={() => router.back()}
//                 disabled={saving}
//               >
//                 Cancel
//               </Button>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
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
import { Loader2 } from "lucide-react";

export default function AddEmployeePage() {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];
  const { data: session } = useSession();

  const currentUserDept = session?.user?.department?.toLowerCase() ?? "";

  const initialForm = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    contact: "",
    department: "",
    role: "",
    joiningDate: "",
    status: "",
    profileImage: null as File | null,
  };

  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  const availableRoles =
    form.department && departmentRoles[form.department]
      ? departmentRoles[form.department]
      : [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, profileImage: e.target.files[0] });
    }
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
    setSaving(true);

    const formattedFirstName = capitalizeName(form.firstName);
    const formattedLastName = capitalizeName(form.lastName);

    const formattedFullName = `${formattedFirstName} ${formattedLastName}`;

    const updatedForm = {
      ...form,
      firstName: formattedFirstName,
      lastName: formattedLastName,
    };

    
    for (const [key, value] of Object.entries(updatedForm)) {
      if (key === "profileImage") continue;
      if (typeof value === "string" && !value.trim()) {
        toast.error(`Please fill the ${key} field`, { position: "top-center" });
        setSaving(false);
        return;
      }
    }

    const singleNameRegex = /^[A-Z][a-z]+$/;
    if (!singleNameRegex.test(formattedFirstName)) {
      toast.error("Invalid first name");
      setSaving(false);
      return;
    }

    if (!singleNameRegex.test(formattedLastName)) {
      toast.error("Invalid last name");
      setSaving(false);
      return;
    }

    const nameRegex = /^([A-Z][a-z]+)(\s[A-Z][a-z]+)*$/;
    if (!nameRegex.test(formattedFullName)) {
      toast.error(
        "Name must contain only letters and each word should start with a capital letter",
        { position: "top-center" }
      );
      setSaving(false);
      return;
    }

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(updatedForm.email.trim())) {
      toast.error("Email must include @ and a valid domain", { position: "top-center" });
      setSaving(false);
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
      setSaving(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Password and Confirm Password do not match", { position: "top-center" });
      setSaving(false);
      return;
    }

    const contactRegex = /^[0-9]{10}$/;
    if (!contactRegex.test(updatedForm.contact.trim())) {
      toast.error("Contact must be 10 digits", { position: "top-center" });
      setSaving(false);
      return;
    }

    try {
      const formData = new FormData();
      const { confirmPassword, ...payload } = updatedForm;
      payload.password = password;
      for (const [key, value] of Object.entries(payload)) {
        if (key === "profileImage" && value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value as string);
        }
      }

      const res = await fetch("/api/employees", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        const errorMessage = data?.error || data?.message || "";

        if (errorMessage.toLowerCase().includes("duplicate") || errorMessage.toLowerCase().includes("exists")) {
          toast.error("Email already exists", { position: "top-center", style: { textAlign: "center" }, duration: 2000 });
        } else {
          toast.error("Failed to add employee", { position: "top-center", style: { textAlign: "center" }, duration: 2000 });
        }
      } else {
        toast.success("Employee added successfully", { position: "top-center", style: { textAlign: "center" }, duration: 2000 });
        setForm(initialForm);
        router.push("/employees");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong", { position: "top-center", style: { textAlign: "center" }, duration: 2000 });
    }

    setSaving(false);
  };

  const selectInputLike = "w-full border border-gray-300 rounded-md px-3 py-2 text-sm";

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
            <Input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} />
            <Input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} />
            <Input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />

            <div className="relative">
              <Input type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={form.password} onChange={handleChange} className="pr-10" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>

            <div className="relative">
              <Input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} className="pr-10" />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>

            <Input name="contact" placeholder="Contact" inputMode="numeric" pattern="[0-9]*" value={form.contact} onChange={handleChange} />

            <Select value={form.department} onValueChange={(value) => setForm({ ...form, department: value, role: "" })}>
              <SelectTrigger className={selectInputLike}><SelectValue placeholder="Department" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="HumanResources">Human Resources</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
                {currentUserDept.toLowerCase() === "super_admin" && <SelectItem value="admin">Admin</SelectItem>}
              </SelectContent>
            </Select>

            <Select value={form.role} onValueChange={(value) => setForm({ ...form, role: value })} disabled={!form.department}>
              <SelectTrigger className={selectInputLike}><SelectValue placeholder="Role" /></SelectTrigger>
              <SelectContent>
                {availableRoles.map((role) => (<SelectItem key={role} value={role}>{role}</SelectItem>))}
              </SelectContent>
            </Select>

            <Input type="date" name="joiningDate" min={today} value={form.joiningDate} onChange={(e) => setForm({ ...form, joiningDate: e.target.value })} />

            <Select value={form.status} onValueChange={(value) => setForm({ ...form, status: value })}>
              <SelectTrigger className={selectInputLike}><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex flex-col items-start">
              <label className="relative block w-full">
                <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                <div className="h-9 w-full px-3 pr-10 border border-input rounded-md bg-white text-sm text-muted-foreground flex items-center">Choose File</div>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
              </label>
              {form.profileImage ? <p className="text-sm text-gray-700">Selected file: {form.profileImage.name}</p> : <p className="text-sm text-gray-400"></p>}
            </div>

            <div className="flex justify-center gap-3 pt-6">
              <Button type="submit" size="sm" disabled={saving}>
                {saving ? <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Adding...</span> : "Add"}
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => router.back()} disabled={saving}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
