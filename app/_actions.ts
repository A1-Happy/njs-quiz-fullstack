"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

//add a user
const addUser = async (user: {
  name: string;
  email: string;
  image: string;
}) => {
  console.log("Adding user: ", user);
  const newUser = await prisma.user.create({
    data: user,
  });
  console.log("New user created: ", newUser);
  return newUser;
};

const getUserFromEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  return user;
};

export async function createQuizAction(
  title: string,
  author: {
    name: string;
    email: string;
    image: string;
  }
) {
  //from the User model check if the user with the given email exists
  const userFromEmail =
    (await getUserFromEmail(author.email)) || (await addUser(author));

  console.log(userFromEmail);

  //create a new quiz
  const quiz = await prisma.quiz.create({
    data: {
      title,
      authorId: userFromEmail?.id,
    },
  });
  console.log("New quiz created: ", quiz);

  //revalidate the path
  revalidatePath(`/quiz/home`);
  return quiz;
}

export async function addQuestionAction(
  quizId: number,
  question: string,
  options: string[],
  correctOptionsIndexes: number[]
) {
  let message = null;
  const newQuestion = await prisma.question
    .create({
      data: {
        quizId,
        question,
        options: {
          create: options
            .map((option, index) => {
              return {
                option,
                isCorrect: correctOptionsIndexes.includes(index),
              };
            })
            .filter((option) => option.option.length > 0),
        },
      },
    })
    .catch((err) => {
      console.log(err);
      message = "Error creating question";
      return null;
    });
  console.log("New question created: ", newQuestion);

  revalidatePath(`/quiz/${quizId}/dashboard`);

  console.log("Options: ", options);

  return { question: newQuestion, message };
}

export async function createAttemptAction(
  quizId: number,
  //the set of option ids that the user selected
  setOfUserOptionIds: Set<number>,
  //the user
  user: { email: string; name: string; image: string }
) {
  console.log("Creating attempt for quiz: ", quizId);

  //get user from email
  const userFromEmail =
    (await getUserFromEmail(user.email)) || (await addUser(user));

  //check if the user has not already attempted the quiz
  const attempted = await prisma.attempt.findFirst({
    where: {
      quizId,
      userId: {
        equals: userFromEmail?.id,
      },
    },
  });

  if (attempted) {
    console.log("Attempt already exists");
    return null;
  }

  //get set of all the options ids for the quiz
  const options = await prisma.option.findMany({
    where: {
      question: {
        quizId,
      },
    },
    select: {
      id: true,
      isCorrect: true,
    },
  });

  //convert to set of ids
  const setOfAllOptionIds = new Set(options.map((option) => option.id));

  //convert setOfAllOptionIds from list to set of ids
  // console.log("Option ids set: ", setOfAllOptionIds);

  //check if the set of user option ids is a subset of the set of all option ids
  const isSubset = [...setOfUserOptionIds].every((id) =>
    setOfAllOptionIds.has(id)
  );

  if (!isSubset) {
    console.log("Invalid option ids");
    return null;
  }

  //calculate score
  const score = [...setOfUserOptionIds].reduce((acc, id) => {
    const option = options.find((option) => option.id === id);
    if (option?.isCorrect) {
      return acc + 1;
    }
    return acc;
  }, 0);

  //calculate total score
  const totalScore = options.reduce((acc, option) => {
    if (option.isCorrect) {
      return acc + 1;
    }
    return acc;
  }, 0);

  //calculate negative marks
  const negativeMarks = [...setOfUserOptionIds].reduce((acc, id) => {
    const option = options.find((option) => option.id === id);
    if (!option?.isCorrect) {
      return acc + 1;
    }
    return acc;
  }, 0);

  //create attempt
  const attempt = await prisma.attempt.create({
    data: {
      quizId,
      score: score - negativeMarks,
      totalScore,
      correct: score,
      incorrect: negativeMarks,
      userId: userFromEmail?.id,
    },
  });

  //get the attempt id
  const attemptId = attempt.id;

  //create choices without using prisma.choice.createMany because it is not allowed
  //create choices
  const choices = await Promise.all(
    [...setOfUserOptionIds].map((optionId) => {
      return prisma.choice.create({
        data: {
          optionId,
          attemptId,
        },
      });
    })
  );

  console.log("Attempt created: ", attempt);

  //revalidate the quiz dashboard page
  revalidatePath(`/quiz/${quizId}/dashboard`);

  //return the attempt id
  return attemptId;
}
