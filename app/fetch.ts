"use server";

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

export async function getQuizAction(quizId: number) {
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
  console.log("Quiz: ", quiz);
  return quiz;
}

export async function getQuizForUserAction(quizId: number) {
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
export async function getAttemptAction(attemptId: number) {
  const attempt = await prisma.attempt.findUnique({
    where: {
      id: attemptId,
    },
    include: {
      quiz: {
        include: {
          author: true,
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
  console.log("Attempt: ", attempt);
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
