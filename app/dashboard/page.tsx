import {getServerSession, Session} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]";
import LoadMeets from "@/components/loadMeets";

export default async function DashboardPage() {

    const session: Session | null = await getServerSession(authOptions);

    return (
        <div>
            <h1>Your username is {session?.user.username}</h1>
            Private Dashboard Page - you need to be logged in to view this.
            <div>
                <h2>Your meets:</h2>
                <LoadMeets/>
            </div>
        </div>
    )
}