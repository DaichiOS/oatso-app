"use client"

import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoggedInPage({ user }: { user: Session["user"] }) {
    const router = useRouter();

    return (
        <div className="already-logged-in">
            <p>You're currently logged in as {user?.name}</p>
            <div className="options">
                <button onClick={() => router.push("/")}>Go to Home</button>
                <button onClick={() => signOut()}>Sign Out</button>
            </div>
        </div>
    )
 }
