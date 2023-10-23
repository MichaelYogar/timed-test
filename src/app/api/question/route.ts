import prisma from "@/src/lib/prisma";
import { getQSParamFromURL } from "@/src/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest & { url: string }) {
  const id = Number(getQSParamFromURL("id", req.url));
  const auth = getQSParamFromURL("auth", req.url);
  console.log(id);
  console.log(auth);

  if (auth === "false" && id !== 1) {
    console.log("I get here");
    return NextResponse.json({ message: "unauthorized" }, { status: 401 });
  }

  const questions = await prisma.question.findMany({
    where: {
      interviewId: Number(id),
    },
  });

  return NextResponse.json(questions, { status: 200 });
}
