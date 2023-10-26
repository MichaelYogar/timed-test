import prisma from "@/src/lib/prisma";
import { getQSParamFromURL } from "@/src/lib/utils";
import { NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { options } from "../auth/[...nextauth]/nextAuthOptions";

export async function GET(req: NextRequest, res: NextApiResponse) {
  const userId = Number(getQSParamFromURL("userId", req.url));
  console.log(userId);

  const interviews = await prisma.interview.findMany({
    where: {
      userId: userId ? userId : null,
    },
    include: {
      questions: true,
    },
  });

  return NextResponse.json(interviews, { status: 200 });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(options);
  if (!session) return NextResponse.json("Unauthorized", { status: 401 });

  const { title, questions, userId } = await request.json();

  const interview = await prisma.interview.create({
    data: { title, userId },
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
