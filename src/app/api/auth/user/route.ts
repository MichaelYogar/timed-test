import prisma from "@/src/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  try {
    const user = await prisma.user.create({ data: { username, password } });
    return NextResponse.json({ id: user.id }, { status: 201 });
  } catch (error: any) {
    // TODO: Workaround because instanceof not working - https://github.com/prisma/prisma/issues/12128
    if (error.constructor.name === Prisma.PrismaClientKnownRequestError.name) {
      if (error.code === "P2002") {
        return NextResponse.json({ error }, { status: 409 });
      }
    }
    return NextResponse.json({ error: error }, { status: 400 });
  }
}
