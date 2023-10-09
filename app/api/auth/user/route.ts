import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const AUTH_USER = "/api/auth/user";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  try {
    const user = await prisma.user.create({ data: { username, password } });
    return NextResponse.json({ id: user.id }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 400 });
  }
}
