"use client";

import { Input } from "@/components/ui/input";
import { createQuizAction } from "@/app/_actions";
import { useEffect, useRef, useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Loader, Loader2 } from "lucide-react";

export default function CreateQuiz() {
  const author = useSession().data?.user as {
    email: string;
    name: string;
    image: string;
  };

  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState("");
  const [statusColor, setStatusColor] = useState("text-red-500");
  const [creating, startCreating] = useTransition();

  const handleSubmit = async (data: FormData) => {
    const title = data.get("quizName");
    if (!title || typeof title !== "string") {
      setStatusColor("text-red-500");
      setStatus("Title is required");
      return;
    } else {
      // setStatus("Your quiz is being generated...");
      // setStatusColor("text-green-500");
      formRef.current?.reset();
      //call a server action to create a quiz
      if (author && author.email && author.name) {
        const newQuiz = await createQuizAction(title, author);
        if (!newQuiz) {
          setStatus("Error creating quiz, please try again later.");
          setStatusColor("text-red-500");
          return;
        }
        setStatus("Quiz created successfully");
        setStatusColor("text-green-500");
        //redirect to the quiz dashboard
        redirect(`/quiz/home`);
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
          action={(formData) => {
            startCreating(() => handleSubmit(formData));
          }}
          className="flex flex-col items-center  "
        >
          <label htmlFor="title" className="text-gray-700 font-bold mb-2">
            Title
          </label>
          <Input className="max-w-fit" type="text" name="quizName" />
          <div className="mb-4"></div>
          <button type="submit">Create</button>

          {/* show status */}
          {creating && <Loader className="w-4 h-4 animate-spin" />}
          <div className={statusColor}>{status}</div>
        </form>
      </div>
    </div>
  );
}
