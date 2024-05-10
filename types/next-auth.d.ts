import NextAuth from "next-auth";
import { JWT, DefaultJWT } from "next-auth/JWT"

declare module "next-auth" {
    interface Session {
        user: {
            id: string,
            username: string,
        }
    }
    interface User {
        id: string,
        username: string,
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        user: {
            id: string,
            username: string,
        }
    }
}