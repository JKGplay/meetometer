import Form from "@/app/login/form";
import {getServerSession} from "next-auth";
import {redirect} from "next/navigation";

export default async function Login() {
    const session = await getServerSession();
    if(session) {
        redirect('/');
    }
    return (
        <Form/>
    )
}