import { ShowQuizToUser } from "@/app/(show)/components/ShowQuizToUser";
import { getQuizForUserAction } from "@/app/fetch";

export default async function Attempt({ params }: { params: { id: string } }) {
  const quizId = parseInt(params.id);
  const quiz = await getQuizForUserAction(quizId);

  if (!quiz) {
    return <div>Quiz not found</div>;
  }

  return <ShowQuizToUser quiz={quiz} />;
}
