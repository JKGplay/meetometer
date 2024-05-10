import Form from "@/app/meet/new/form"
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]";


export default async function NewMeet() {
    const session = await getServerSession(authOptions);

    const id = session?.user?.id as string;

    return (
        <Form userId={id}/>
    )
}