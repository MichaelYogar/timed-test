import prisma from "@/src/lib/prisma";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const options: NextAuthOptions = {
  pages: { signIn: "/user/login" },
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user && token.sub) {
        session.user.id = Number(token.sub);
      }

      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
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
