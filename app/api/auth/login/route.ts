import { serialize } from "cookie";
import { SignOptions, sign, verify } from "jsonwebtoken";
import { NextResponse } from "next/server";

export const AUTH_LOGIN = "/api/auth/login";
const MAX_AGE = 60 * 60;

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (username !== "admin" || password !== "admin")
    return NextResponse.json({ error: "No user found" }, { status: 401 });

  const payload = { username };
  const secret = process.env.JWT_SECRET || "";
  const options: SignOptions = {
    expiresIn: MAX_AGE,
  };
  const token = sign(payload, secret, options);

  const seralized = serialize("asdf", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: MAX_AGE,
    path: "/",
  });

  const response = {
    message: "Authenticated!",
  };

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { "Set-Cookie": seralized },
  });
}
