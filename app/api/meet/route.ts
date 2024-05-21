import {NextRequest, NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {

    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'There is no session' }, { status: 420 });
    }
    const data = await request.json();
    console.log('data', data.userId);
    console.log('session', session.user.id);
    if(data.userId !== session.user.id) {
        return NextResponse.json({ error: 'Your session is different from request' }, { status: 421 });
    }
    console.log({ data });

    console.log('dateFrom', data.dateFrom)

    const response = await prisma.meet.create({
        data: {
            title: data.title,
            description: data.description,
            dateFrom: data.dateFrom,
            dateTo: data.dateTo,
            author: {
                connect: {
                    id: data.userId,
                }
            }
        }
    })
    if(!response) {
        return NextResponse.json({ error: 'Error with database' }, { status: 422 });
    }

    console.log({ response });

    return NextResponse.json({ message: 'Meet successfully created', meetId: response.id }, { status: 200 });
}