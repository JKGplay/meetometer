import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]";
import {redirect} from "next/navigation";
import prisma from "@/lib/prisma";
import weekdays from "@/lib/weekdays";
import LoadCalendar from "@/components/loadCalendar";
import moment from "moment";
import '@/app/meet/[meetId]/index.css'
import AddAvailabilityButton from "@/components/addAvailability";

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
        },
        select: {
            id: true,
            title: true,
            description: true,
            dateFrom: true,
            dateTo: true,
            authorId: true,
            participants: {
                select: {
                    id: true,
                    user: true,
                    availableDays: true,
                    userId: true,
                    meetId: true,
                }
            },
        }
    })

    console.log({meet})
    console.log(meet?.participants)

    if (!meet) {
        console.log("meet not found");
        redirect('/dashboard');
    }

    const formattedDate = (date: Date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString();
        const weekday = (date.getDay() + 6) % 7;
        //makes that sunday (which is 0 in Date.getDay()) goes to 6 in weekdays table and rest of the days are going down by one

        return `${day}.${month}.${year} (${weekdays[weekday]})`;
    }

    return (
        <div>
            <h1>{meet.title}</h1>

            <p>{`Od: ${formattedDate(meet.dateFrom)}`}</p>
            <p>{`Od: ${formattedDate(meet.dateTo)}`}</p>
            <AddAvailabilityButton/>
            <LoadCalendar
                meet={meet}
            />
        </div>
    )
}