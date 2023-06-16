"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Question, Quiz } from "@prisma/client";
import { useEffect, useState } from "react";
import { createAttemptAction } from "@/app/_actions";
import { useSession } from "next-auth/react";

export function ShowQuizToUser({
  quiz,
}: {
  quiz: Quiz & {
    questions: (Question & {
      options: {
        id: number;
        option: string;
      }[];
    })[];
  };
}) {
  const [status, setStatus] = useState("");
  const user = useSession().data?.user as {
    name: string;
    email: string;
    image: string;
  };
  const [checkedBoxes, setCheckedBoxes] = useState(new Set<number>());

  //TODO: add handleSubmit function
  const handleSubmit = async () => {
    const attemptId = await createAttemptAction(quiz.id, checkedBoxes, user);

    if (!attemptId) {
      setStatus("You've already made an attempt on the quiz.");
      return;
    }

    //go to page /quiz/quizId/attempt/attemptId/result
    window.location.href = `/quiz/${quiz.id}/attempt/${attemptId}/result`;
  };

  return (
    <div className="text-center sm:px-20 px-10">
      <div className="mb-28"></div>
      <h1 className="text-4xl font-bold">Attempt Quiz</h1>
      <div className="mb-10"></div>
      <Card className="mb-20">
        <CardHeader>
          <CardTitle>{quiz?.title}</CardTitle>
          <CardDescription>
            Quick tip: Mark only the correct options.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Card>
            <CardHeader>
              <CardTitle>Questions</CardTitle>
              <CardDescription>
                This includes the questions for the quiz.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {quiz?.questions.map((question, questionIndex) => (
                <div key={questionIndex} className="text-start">
                  <Card>
                    <CardContent>
                      <div className="mb-6"></div>
                      <div className="mb-2 flex">
                        <div className="w-7 min-w-fit pr-1">
                          Q{questionIndex + 1}.
                        </div>
                        <div>{question.question}</div>
                      </div>
                      <div className="">
                        <div className="max-w-fit text-start">
                          {question.options.map((option, index) => (
                            <div
                              className="flex items-center gap-2"
                              key={index}
                            >
                              <label className="cursor-pointer">
                                <Checkbox
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setCheckedBoxes(
                                        new Set(checkedBoxes.add(option.id))
                                      );
                                    } else {
                                      checkedBoxes.delete(option.id);
                                      setCheckedBoxes(new Set(checkedBoxes));
                                    }
                                  }}
                                  className="w-4 h-4 mr-2"
                                />
                                {option.option}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </CardContent>
          </Card>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button variant={"outline"} onClick={handleSubmit}>
            Submit
          </Button>
          <div className="text-red-500">{status}</div>
        </CardFooter>
      </Card>
    </div>
  );
}
