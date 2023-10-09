import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!req.body) return null;
        const { username, password } = req.body;
        console.log(credentials);
        console.log(username);
        console.log(password);

        const user = { id: "1", name: "J Smith", email: "jsmith@example.com" };

        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
};
