import {NextResponse} from "next/server";
import {hash} from "bcrypt";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const res = await request.json();
        const {username, email, password} = res;
        //validation

        const hashedPassword = await hash(password, 10);

        const result = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            }
        })
        return NextResponse.json({ data: res });
    } catch (e) {
        console.error(e);
    }
}