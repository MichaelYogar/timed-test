import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export const QUESTION_ROUTE = "/api/question/";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const qs = getQSParamFromURL("id", req.url);

  const questions = await prisma.question.findMany({
    where: {
      interviewId: Number(qs),
    },
  });

  return NextResponse.json(questions, { status: 200 });
}

export function getQSParamFromURL(
  key: string,
  url: string | undefined
): string | null {
  if (!url) return "";
  const search = new URL(url).search;
  const urlParams = new URLSearchParams(search);
  return urlParams.get(key);
}
