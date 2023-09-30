import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const PREP_ROUTE = "/api/prep";

export async function GET() {
  const questions = await prisma.question.findMany();
  return NextResponse.json(questions, { status: 200 });
}

export async function POST(request: Request) {
  const { forms } = await request.json();

  const data = forms.map((form) => {
    const duration = getMilliSeconds(
      Number(form.minutes),
      Number(form.seconds)
    );
    return { content: form.question, duration };
  });

  const question = await prisma.question.createMany({
    data,
  });
  return NextResponse.json(question, { status: 201 });
}

const getMilliSeconds = (minutes: number, seconds: number) => {
  return 1000 * (minutes * 60 + seconds);
};
