import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import Link from "next/link";
import Logout from "@/app/logout";
import {authOptions} from "@/app/api/auth/[...nextauth]";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Meetometer",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  console.log('layout.tsx', { session })
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav>
          {!!session &&
            <div className="flex items-center p-2">
              <Logout className="p-1 m-1 border"/>
              <Link
                className="p-1 m-1 border"
                href="/meet/new"
              >
                Make new Meet
              </Link>
            </div>

          }
          {!session &&
            <div className="flex items-center p-2">
              <Link
                className="p-1 m-1 border"
                href="/login"
              >
                Login
              </Link>
            </div>
          }
        </nav>
        {children}
      </body>
    </html>
  );
}
