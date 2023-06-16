import {
  getAllAttemptedQuizzesOfUserAction,
  getAllQuizzesOfAuthorAction,
} from "@/app/fetch";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { relativeDate } from "@/lib/utils";
import LogOutButton from "../../components/LogOutButton";

export default async function ShowQuizzes() {
  const author = (await getServerSession(authOptions))?.user as {
    name: string;
    email: string;
    image: string;
  };
  const quizzes = await getAllQuizzesOfAuthorAction(author);
  const attempts = await getAllAttemptedQuizzesOfUserAction(author);
  return (
    <div className="text-center mx-10">
      <div className="mb-28"></div>

      <div className="flex flex-col gap-12">
        <Card className="pt-2">
          <CardContent className="pb-2">
            <div className="flex justify-between items-center">
              <div>Logged in as: {author.name}</div>
              <div>
                <LogOutButton />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quizzes Created</CardTitle>
            <CardDescription>
              This section includes the quizzes created by you.
            </CardDescription>
            <CardContent className="p-0">
              <div className="flex flex-col items-center gap-2">
                {quizzes ? (
                  quizzes.map((quiz) => (
                    <Link
                      key={quiz.id}
                      href={`/quiz/${quiz.id}/dashboard`}
                      className="w-[1000px] max-w-full"
                    >
                      <Button
                        className="flex justify-between w-full"
                        variant={"outline"}
                      >
                        <h1>{quiz.title}</h1>
                        <div>{relativeDate(quiz.createdAt)}</div>
                      </Button>
                    </Link>
                  ))
                ) : (
                  //show that no quizzes found
                  <div className="text-sm font-bold">No Quizzes Found</div>
                )}
              </div>
            </CardContent>
          </CardHeader>
          <CardFooter>
            <Link href="/quiz/create">
              <Button variant={"outline"}>Create quiz</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quizzes Attempted</CardTitle>
            <CardDescription>
              This section includes the quizzes attempted by you.
            </CardDescription>
            <CardContent className="p-0">
              <div className="flex flex-col items-center gap-2">
                {attempts && attempts.length !== 0 ? (
                  attempts.map((attempt) => (
                    <Link
                      key={attempt.id}
                      href={`/quiz/${attempt.quiz.id}/attempt/${attempt.id}/result`}
                      className="w-[1000px] max-w-full"
                    >
                      <Button
                        className="flex justify-between w-full"
                        variant={"outline"}
                      >
                        <h1>{attempt.quiz.title}</h1>
                        <div>{relativeDate(attempt.createdAt)}</div>
                      </Button>
                    </Link>
                  ))
                ) : (
                  //show that no quizzes found
                  <div className="text-sm font-bold">No Quizzes Found</div>
                )}
              </div>
            </CardContent>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
