import prisma from "../../prep/src/lib/prisma";
async function main() {
  //   const interview = {
  //     content: "Tell me about yourself?",
  //     duration: 60,
  //     interviewId: interview.id,
  //   };
  const interview = await prisma.interview.findFirst({
    where: { id: 1 },
  });

  if (!interview) {
    const interview = await prisma.interview.create({
      data: { title: "Example mock interview" },
    });

    await prisma.question.create({
      data: {
        interviewId: interview.id,
        content: "Tell me about yourself",
        duration: 60000,
        createdAt: new Date(),
      },
    });

    await prisma.question.create({
      data: {
        interviewId: interview.id,
        content: "Where do you see yourself in 5 years",
        duration: 90000,
        createdAt: new Date(),
      },
    });
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
