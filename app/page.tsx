import {getServerSession, Session} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]";
import {redirect} from "next/navigation";

export default async function Home() {
    const session: Session | null = await getServerSession(authOptions);

    if (session) {
        redirect('/dashboard');
    } else {
        redirect('/register');
    }

}
