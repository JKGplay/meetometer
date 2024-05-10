'use client'

import {signOut} from "next-auth/react";

export default function Logout({ className }: { className?: string}) {
    return (
        <span className={className} onClick={() => {signOut()}}>
            Logout
        </span>
    )
}