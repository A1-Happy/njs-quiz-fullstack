"use client";

import { Input } from "@/components/ui/input";
import { createQuizAction } from "@/app/_actions";
import { useRef, useState } from "react";
import { useSession } from "next-auth/react";

export default function CreateQuiz() {
  const author = useSession().data?.user as {
    email: string;
    name: string;
    image: string;
  };

  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState("");
  const [statusColor, setStatusColor] = useState("text-red-500");

  const handleSubmit = async (data: FormData) => {
    const title = data.get("quizName");
    if (!title || typeof title !== "string") {
      setStatusColor("text-red-500");
      setStatus("Title is required");
      return;
    } else {
      setStatus("");
      setStatusColor("text-green-500");
      formRef.current?.reset();
      //call a server action to create a quiz
      if (author && author.email && author.name) {
        const newQuiz = await createQuizAction(title, author);
        const quizId = newQuiz.id;
        setStatus("Quiz created successfully");
        //redirect to the quiz dashboard
        window.location.href = `/quiz/${quizId}/dashboard`;
      }
    }
  };

  return (
    <div className="text-center">
      <div className="mb-28"></div>
      <h1 className="text-4xl font-bold">Create Quiz</h1>
      <div className="mb-28"></div>
      <div>
        <form
          ref={formRef}
          action={handleSubmit}
          className="flex flex-col items-center  "
        >
          <label htmlFor="title" className="text-gray-700 font-bold mb-2">
            Title
          </label>
          <Input className="max-w-fit" type="text" name="quizName" />
          <div className="mb-4"></div>
          <button type="submit">Create</button>

          {/* show status */}
          <div className={statusColor}>{status}</div>
        </form>
      </div>
    </div>
  );
}
