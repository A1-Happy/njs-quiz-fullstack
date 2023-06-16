import { prisma } from "@/lib/prisma";

const getUserFromEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  return user;
};

export async function getQuizForDashboardAction(quizId: number, email: string) {
  //check if the email is of the author of the quiz
  const userId = (await getUserFromEmail(email))?.id;

  const quiz = await prisma.quiz.findUnique({
    where: {
      id: quizId,
    },
    include: {
      questions: {
        include: {
          options: true,
        },
      },
    },
  });

  if (quiz?.authorId !== userId) {
    return null;
  }
  return quiz;
}

export async function getQuizForUserAction(quizId: number) {
  const quiz = await prisma.quiz.findUnique({
    where: {
      id: quizId,
    },
    include: {
      questions: {
        include: {
          options: {
            select: {
              option: true,
              id: true,
            },
          },
        },
      },
    },
  });
  return quiz ? quiz : null;
}

// function to get everything of an attempt
export async function getAttemptAction(attemptId: number, email: string) {
  if (!attemptId || !email) {
    return null;
  }
  const userId = (await getUserFromEmail(email))?.id;
  const attempt = await prisma.attempt.findFirst({
    where: {
      id: attemptId,
    },
    include: {
      quiz: {
        include: {
          author: {
            select: {
              name: true,
            },
          },
          questions: {
            include: {
              options: true,
            },
          },
        },
      },
      choices: {
        include: {
          option: true,
        },
      },
      user: true,
    },
  });

  if (attempt?.userId !== userId && attempt?.quiz.authorId !== userId) {
    return null;
  }

  return attempt;
}

//function to get all attempts of a quiz
export async function getAllAttemptsOfQuizAction(quizId: number) {
  const attempts = await prisma.attempt.findMany({
    where: {
      quizId,
    },
    include: {
      quiz: true,
      choices: {
        include: {
          option: true,
        },
      },
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return attempts;
}

//function to get all quizzes of an author
export async function getAllQuizzesOfAuthorAction(author: {
  name: string;
  email: string;
  image: string;
}) {
  const authorId = (await getUserFromEmail(author.email))?.id;

  if (!authorId) {
    return null;
  }

  const quizzes = await prisma.quiz.findMany({
    where: {
      authorId,
    },
    include: {
      attempts: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return quizzes;
}

//function to get all attempted quizzes of a user
export async function getAllAttemptedQuizzesOfUserAction(user: {
  name: string;
  email: string;
  image: string;
}) {
  const userId = (await getUserFromEmail(user.email))?.id;

  if (!userId) {
    return null;
  }

  const quizzes = await prisma.attempt.findMany({
    where: {
      userId,
    },
    include: {
      quiz: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return quizzes;
}
