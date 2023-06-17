import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { getAttemptAction } from "@/app/fetch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { relativeDate } from "@/lib/utils";
import { getServerSession } from "next-auth";

import Link from "next/link";

export default async function AttemptResult({
  params,
}: {
  params: { attemptId: string; id: string };
}) {
  const session = await getServerSession(authOptions);
  const attemptId = parseInt(params.attemptId);
  const quizId = params.id;
  const attempt = await getAttemptAction(attemptId, session?.user?.email!);
  const quiz = attempt?.quiz;

  if (quiz?.id !== quizId) {
    return <div>Unauthorised access.</div>;
  }

  const userChoices = attempt?.choices.map((choice) => choice.optionId);

  return (
    <div className="text-center mx-10">
      <div className="mb-28"></div>
      <h1 className="text-2xl font-bold">Result</h1>
      <div className="mb-10"></div>
      <div className="flex flex-col gap-10">
        <Table>
          {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead className="flex-1 w-1/4 text-center">Quiz</TableHead>
              <TableHead className="flex-1 w-1/4 text-center">
                Attempted By
              </TableHead>
              <TableHead className="flex-1 w-1/4 text-center">
                Created By
              </TableHead>
              <TableHead className="flex-1 w-1/4 text-center">
                Attempted At
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="flex-1 w-1/4 text-center">
                {attempt?.quiz.title}
              </TableCell>
              <TableCell className="flex-1 w-1/4 text-center">
                {attempt?.user.name}
              </TableCell>
              <TableCell className="flex-1 w-1/4 text-center">
                {attempt?.quiz.author.name}
              </TableCell>
              <TableCell className="flex-1 w-1/4 text-center">
                {relativeDate(attempt?.createdAt!)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Table>
          {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead className="flex-1 w-1/4 text-center">
                Correct Marks
              </TableHead>
              <TableHead className="flex-1 w-1/4 text-center">
                Negative Marks
              </TableHead>
              <TableHead className="flex-1 w-1/4 text-center">
                Obtained Marks
              </TableHead>
              <TableHead className="flex-1 w-1/4 text-center">
                Total Marks
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="flex-1 w-1/4 text-center">
                {attempt?.correct}
              </TableCell>
              <TableCell className="flex-1 w-1/4 text-center">
                {attempt?.incorrect}
              </TableCell>
              <TableCell className="flex-1 w-1/4 text-center">
                {attempt?.score}
              </TableCell>
              <TableCell className="flex-1 w-1/4 text-center">
                {attempt?.totalScore}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="mb-10"></div>
      {quiz ? (
        <div>
          <CardContent>
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
                                  (userChoices?.includes(option.id)
                                    ? option.isCorrect
                                      ? "text-green-500"
                                      : "text-red-500"
                                    : "")
                                }
                                key={option.id}
                              >
                                {index + 1}: {option.option}{" "}
                                {option.isCorrect ? "✅" : ""}
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </ul>
            </CardContent>
          </CardContent>
        </div>
      ) : (
        <div className="py-20">Quiz not found</div>
      )}
    </div>
  );
}
