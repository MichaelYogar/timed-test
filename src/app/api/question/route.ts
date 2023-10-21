import prisma from "@/src/lib/prisma";
import { getQSParamFromURL } from "@/src/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest & { url: string }) {
  const qs = getQSParamFromURL("id", req.url);

  const questions = await prisma.question.findMany({
    where: {
      interviewId: Number(qs),
    },
  });

  return NextResponse.json(questions, { status: 200 });
}
