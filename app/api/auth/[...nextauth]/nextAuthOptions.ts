import prisma from "@/lib/prisma";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const options: NextAuthOptions = {
  pages: { signIn: "/user/login" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (credentials === undefined) return null;
        const { username, password } = credentials;

        const result = await prisma.user.findUnique({
          where: {
            username,
            password,
          },
        });

        let user;

        if (result != null)
          user = { id: result.id.toString(), name: username, email: "" };

        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
};
