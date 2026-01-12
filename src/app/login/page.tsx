"use client";

import { AiFillEye } from "react-icons/ai";
import { FaRegEyeSlash } from "react-icons/fa6";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


export default function HomePage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.includes("@") || !email.includes(".")) {
            toast.error("Please enter a valid email address");
            return;
        }

        if (!password) {
            toast.error("Password is required");
            return;
        }

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (res?.ok) {
            toast.success("Login successful");
            setTimeout(() => {
                toast.dismiss();
                router.push("/employees");
            }, 800);
        } else {
            toast.error(res?.error || "Invalid email or password");
        }
    };
    return (

        <div className="flex min-h-screen items-center justify-center bg-gray-200">
            <Card className="w-96">
                <CardHeader>
                    <CardTitle className="text-center font-bold text-xl">Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label className="mb-2 block">Email</Label>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} required />
                        </div>

                        <div>
                            <Label className="mb-2 block">Password</Label>

                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />

                                <div
                                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaRegEyeSlash /> : <AiFillEye />}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center pt-2">
                            <Button type="submit">Login</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>

    );
}
