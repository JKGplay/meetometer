import {getServerSession, Session} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]";
import Link from "next/link";
import prisma from "@/lib/prisma";

export default async function LoadMeets() {

    const session: Session | null = await getServerSession(authOptions);

    const userId = session?.user.id;

    const meets = await prisma.meet.findMany({
        where: {
            OR: [
                { authorId: userId, },
                {participants: {
                    some: {
                        userId: userId,
                    },
                }},
            ],
        },
    });

    const formattedDate = (date: Date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString();

        return `${day}.${month}.${year}`;
    }

    return (
        <div
            className="flex flex-row gap-2 mx-auto max-w-md mt-10"
        >
            {meets?.length === 0 &&
                'There are no meets.'
            }
            {meets?.length !== 0 &&
                meets?.map((meet) => (
                    <Link
                        className="border p-2"
                        key={meet.id}
                        href={`/meet/${meet.id}`}
                    >
                        <h1 className="text-2xl font-bold">{meet.title}</h1>
                        <p>{`Od: ${formattedDate(meet.dateFrom)}`}</p>
                        <p>{`Do: ${formattedDate(meet.dateTo)}`}</p>
                    </Link>
                ))
            }
        </div>

    )

}