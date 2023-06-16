import { prisma } from "@/lib/prisma";

const getUserFromEmail = async (email: string) => {
  console.log("Getting user from email: ", email);
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  console.log("user found", user);
  return user;
};

export async function getQuizForDashboardAction(quizId: string, email: string) {
  console.log("quizId: ", quizId);
  console.log("email: ", email);

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
    console.log("User is not the author of the quiz");
    return null;
  }
  console.log("Quiz: ", quiz);
  return quiz;
}

export async function getQuizForUserAction(quizId: string) {
  const quiz = await prisma.quiz
    .findUnique({
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
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
  return quiz;
}

// function to get everything of an attempt
export async function getAttemptAction(attemptId: number, email: string) {
  if (!attemptId || !email) {
    console.log("AttemptId or email not provided");
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
    console.log("user has not attempted the quiz");
    return null;
  }

  console.log("Attempt: ", attempt);
  //remove author from attemt

  return attempt;
}

//function to get all attempts of a quiz
export async function getAllAttemptsOfQuizAction(quizId: string) {
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
  console.log("Attempts: ", attempts);
  return attempts;
}

//function to get all quizzes of an author
export async function getAllQuizzesOfAuthorAction(author: {
  name: string;
  email: string;
  image: string;
}) {
  const authorId = (await getUserFromEmail(author.email))?.id;
  console.log(authorId, author.email);

  if (!authorId) {
    console.log("User not found");
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
  console.log("Quizzes: ", quizzes);
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
    console.log("User not found");
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
  console.log("Quizzes: ", quizzes);
  return quizzes;
}
