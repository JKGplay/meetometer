'use client'

import {FormEvent, useState} from "react";
import {signIn} from "next-auth/react";
import {useRouter} from "next/navigation";
import Image from "next/image";

export default function Form() {

    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter();
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true)
        const formData = new FormData(e.currentTarget);
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                username:   formData.get('username'),
                email:      formData.get('email'),
                password:   formData.get('password'),
            }),
        })

        const res = await signIn('credentials', {
            email:      formData.get('email'),
            password:   formData.get('password'),
            redirect:   false,
        });

        if(!res?.error) {
            router.push('/dashboard');
            router.refresh();
        }
    }

    return (
        <form className="flex flex-col gap-2 mx-auto max-w-md mt-10" onSubmit={handleSubmit}>
            <label htmlFor="username">
                Displayed name
            </label>
            <input
                className="border border-black text-black p-1"
                type="text"
                name="username"
                id="username"
                placeholder="i. e. John"
                required
            />
            <label htmlFor="email">
                Email
            </label>
            <input
                className="border border-black text-black p-1"
                type="email"
                name="email"
                id="email"
                placeholder="i. e. John@Doe.com"
                required
            />
            <label htmlFor="password">
                Password
            </label>
            <input
                className="border border-black text-black p-1"
                type="password"
                name="password"
                id="password"
                required
            />
            <button
                className="mx-auto border p-2 flex flex-row gap-3 bg-white text-black"
                type="submit"
            >
                <p>Register</p>
                <Image
                    className={`rotate align-middle ${loading ? '' : 'hidden'}`}
                    src='/spinner.svg'
                    height={24}
                    width={24}
                    alt="loading"
                />
            </button>
        </form>
    )
}