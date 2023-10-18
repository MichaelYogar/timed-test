import prisma from "@/lib/prisma";
import { getQSParamFromURL } from "@/lib/utils";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextApiResponse) {
  const qs = getQSParamFromURL("type", req.url);

  const interviews = await prisma.interview.findMany({
    include: {
      questions: qs === "true",
    },
  });

  return NextResponse.json(interviews, { status: 200 });
}

export async function POST(request: NextRequest) {
  const { title, questions } = await request.json();
  const token = request.cookies.get("asdf");

  const interview = await prisma.interview.create({
    data: { title },
  });

  const data = questions.map((item) => {
    const duration = getMilliSeconds(
      Number(item.minutes),
      Number(item.seconds)
    );
    return { content: item.question, duration, interviewId: interview.id };
  });

  await prisma.question.createMany({
    data,
  });
  return NextResponse.json({ id: interview.id }, { status: 201 });
}

const getMilliSeconds = (minutes: number, seconds: number) => {
  return 1000 * (minutes * 60 + seconds);
};
