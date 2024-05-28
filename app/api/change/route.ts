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
    if (data.userId !== session.user.id) {
        return NextResponse.json({ error: 'Your session is different from request' }, { status: 421 });
    }

    const req = await prisma.participant.findFirst({
        where: {
            AND: [
                { meetId: data.meetId },
                { userId: data.userId },
            ],
        },
        select: {
            id: true,
        },
    });
    let response = null;
    if (req) {
        response = await prisma.participant.update({
            where: {
                id: req.id,
                meetId: data.meetId as string,
                userId: data.userId as string,
            },
            data: {
                availableDays: data.daysToSend,
            }
        });
    } else {
        response = await prisma.participant.create({
            data: {
                availableDays: data.daysToSend,
                user: {
                    connect: {
                        id: data.userId as string,
                    }
                },
                meet: {
                    connect: {
                        id: data.meetId as string,
                    }
                }
            }
        })
    }


    if (!response) {
        return NextResponse.json({ error: 'Error with database' }, { status: 422 });
    }

    return NextResponse.json({ message: 'Availability successfully changed' }, { status: 200 });
}