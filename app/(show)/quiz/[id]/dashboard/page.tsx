import Link from "next/link";
import {
  getAllAttemptsOfQuizAction,
  getQuizForDashboardAction,
} from "@/app/fetch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { relativeDate } from "@/lib/utils";
import AttemptURLButton from "@/app/(show)/components/AttemptURLButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

export default async function QuizDashboard({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  console.log("sesssssssion", session);
  const quizId = parseInt(params.id);
  const quiz = await getQuizForDashboardAction(quizId, session?.user?.email!);

  if (!quiz) {
    return <div>You are not authorised for this action.</div>;
  }
  const attempts = await getAllAttemptsOfQuizAction(quizId);
  console.log("attempts", attempts);
  const attemptURL = process.env.NEXTAUTH_URL + `/quiz/${quizId}/attempt`;
  return (
    <div className="text-center sm:px-20 px-10">
      <div>
        <div className="mb-28"></div>
        <h1 className="text-4xl font-bold">Quiz Dashboard</h1>
        <div className="mb-10"></div>
      </div>

      <Card className="mb-28">
        {quiz ? (
          <div className="flex flex-col gap-5">
            <CardHeader className="pb-0 m-0">
              <CardTitle>{quiz?.title}</CardTitle>
              <CardDescription className="p-0 m-0">
                The quiz contains the following:
              </CardDescription>
            </CardHeader>

            <Card className="mx-6">
              <CardHeader>
                <CardTitle>Attempt Link</CardTitle>
                <CardDescription>
                  This is the link to share with the students.
                </CardDescription>
                {/* Link that can be copied */}
                <div className="flex justify-between  ">
                  <div className="text-right">
                    <AttemptURLButton attemptURL={attemptURL} />
                  </div>
                </div>
              </CardHeader>
            </Card>

            <CardContent className="pb-0">
              <Card>
                <CardHeader>
                  <CardTitle>Questions</CardTitle>
                  <CardDescription>
                    This includes the questions for the quiz.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="flex flex-col gap-4">
                    {quiz?.questions.map((question, index) => (
                      <div key={question.id} className="text-start">
                        <Card>
                          <CardContent>
                            <div className="mb-6"></div>
                            <div className="mb-2 flex">
                              <div className="w-7 min-w-fit pr-1">
                                Q{index + 1}.
                              </div>
                              <div>{question.question}</div>
                            </div>
                            <div className="">
                              <div className="max-w-fit text-start">
                                {question.options.map((option, index) => (
                                  <div
                                    className={
                                      "text-sm " +
                                      (option.isCorrect ? "text-green-400" : "")
                                    }
                                    key={option.id}
                                  >
                                    {index + 1}: {option.option}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ))}

                    <CardFooter className="p-0">
                      <Link href={`/quiz/${quizId}/add-question`}>
                        <Button
                          variant={"outline"}
                          className="text-blue-400 hover:text-blue-800 hover:bg-black"
                        >
                          Add a question
                        </Button>
                      </Link>
                    </CardFooter>
                  </ul>
                </CardContent>
              </Card>
            </CardContent>

            {/* card number 3 */}
            <Card className="mx-6 mb-6">
              <CardHeader>
                <CardTitle>Attempts</CardTitle>
                <CardDescription>
                  This includes the attempts for the quiz.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3 w-full">
                  {attempts.map((attempt) => (
                    <Link
                      key={attempt.id}
                      href={`/quiz/${quizId}/attempt/${attempt.id}/result`}
                    >
                      <Button
                        variant={"outline"}
                        className="cursor-pointer w-full"
                      >
                        <div className="flex justify-between w-full">
                          <div>
                            Score: {attempt.score}/{attempt.totalScore}
                          </div>
                          <div>{attempt.user.name}</div>
                          <div>{relativeDate(attempt.createdAt)}</div>
                        </div>
                      </Button>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="py-20">Quiz not found</div>
        )}
      </Card>
    </div>
  );
}
