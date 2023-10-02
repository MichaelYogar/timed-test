import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export const INTERVIEW_ROUTE = "/api/interview/";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const qs = getQSParamFromURL("type", req.url);

  const questions = await prisma.interview.findMany({
    include: {
      questions: qs === "true",
    },
  });

  return NextResponse.json(questions, { status: 200 });
}

export async function POST(request: Request) {
  const { interviewTitle, forms } = await request.json();

  const interview = await prisma.interview.create({
    data: { title: interviewTitle },
  });

  const data = forms.map((form) => {
    const duration = getMilliSeconds(
      Number(form.minutes),
      Number(form.seconds)
    );
    return { content: form.question, duration, interviewId: interview.id };
  });

  const question = await prisma.question.createMany({
    data,
  });
  return NextResponse.json({ id: interview.id }, { status: 201 });
}

const getMilliSeconds = (minutes: number, seconds: number) => {
  return 1000 * (minutes * 60 + seconds);
};

export function getQSParamFromURL(
  key: string,
  url: string | undefined
): string | null {
  if (!url) return "";
  const search = new URL(url).search;
  const urlParams = new URLSearchParams(search);
  return urlParams.get(key);
}
