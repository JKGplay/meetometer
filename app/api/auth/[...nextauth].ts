import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {compare} from "bcrypt";
import prisma from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
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
                const checkedUser = users[0]
                const isPasswordCorrect = await compare(credentials?.password || '', checkedUser.password)

                console.log({isPasswordCorrect})

                if (isPasswordCorrect) {
                    const user = {
                        id: checkedUser.id,
                        username: checkedUser.username,
                    }
                    console.log({user});
                    return {
                        id: checkedUser.id,
                        username: checkedUser.username,
                    };
                }

                console.log({ credentials });
                return null;
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.user = user;
            }
            return token
        },
        async session({ session, token }) {
            session.user = token.user;
            return session
        },
    },
}

export default NextAuth(authOptions)