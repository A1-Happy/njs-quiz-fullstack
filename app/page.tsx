"use client";

import CreateQuiz from "./(show)/quiz/create/page";
import { useSession, signIn, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const { data: session } = useSession();
  //redirect to /quiz/create
  redirect("/quiz/home");
  return (
    <div>
      {session === undefined ? (
        <div></div>
      ) : session ? (
        <CreateQuiz />
      ) : (
        <div>Not signed in</div>
      )}
    </div>
  );
}
