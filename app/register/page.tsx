import Form from "@/app/register/form";
import {getServerSession} from "next-auth";
import {redirect} from "next/navigation";
import {authOptions} from "@/app/api/auth/[...nextauth]";

export default async function Register() {
    const session = await getServerSession(authOptions);
    if(session) {
        redirect('/');
    }
    return (
        <Form />
    )
}