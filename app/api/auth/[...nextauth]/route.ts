import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {compare} from "bcrypt";
import prisma from '@/lib/prisma'

const handler = NextAuth({
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/login',
    },
    providers: [
        CredentialsProvider({
            credentials: {
                email: {},
                password: {},
            },
            async authorize(credentials, req) {

                //validation

                console.log('email ', credentials?.email)
                console.log('password ', credentials?.password)

                const users = await prisma.user.findMany({
                    where: {
                        email: credentials?.email,
                    }
                })
                console.log({users})
                const user = users[0]
                const passwordCorrect = await compare(credentials?.password || '', user.password)

                console.log({passwordCorrect})

                if (passwordCorrect) {
                    return {
                        id: user.id,
                        username: user.username,
                    }
                }

                console.log({ credentials });
                return null;
            }
        })
    ]
})

export {handler as GET, handler as POST};