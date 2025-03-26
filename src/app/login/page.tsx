"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const successMessage = searchParams.get('success');
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const result = await signIn("credentials", {
                redirect: false, // Don't redirect automatically
                email,
                password,
            });

            if (result?.error) {
                setError("Invalid credentials");
            } else {
                router.push("/");
            }
        } catch (error) {
            console.error("Login error:", error);
            setError("An error occurred during login");
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <div className="w-full max-w-md p-8 space-y-8 bg-black rounded-lg shadow">
                <h1 className="text-2xl font-bold text-white">Sign in</h1>
                
                {successMessage && (
                    <div className="p-4 mb-4 text-sm text-green-500 bg-green-100 bg-opacity-10 rounded-lg">
                        {successMessage}
                    </div>
                )}
                
                {error && <p className="text-red-500">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-200">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-200">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                    >
                        Sign in
                    </button>
                </form>
                <div className="text-center mt-4">
                    <p>
                        Don't have an account?{" "}
    <Link href="/register" className="text-blue-600 hover:underline">
      Sign up
    </Link>
  </p>
</div>
            </div>
        </div>
    )
}
