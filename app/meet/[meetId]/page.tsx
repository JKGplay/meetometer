import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]";
import {redirect} from "next/navigation";
import prisma from "@/lib/prisma";

export default async function Meet({params}: { params: { meetId: string } }) {

    const session= await getServerSession(authOptions);

    const author: boolean = false;
    const guest: boolean = false;

    if (!session) {
        console.log("session not found");
        redirect('/');
    }

    const meet = await prisma.meet.findFirst({
        where: {
            id: params.meetId,
        }
    })

    if (!meet) {
        console.log("meet not found");
        redirect('/dashboard');
    }



    return (
        <div>
            <h1>{meet.title}</h1>

        </div>
    )
}