"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export default function LogOutButton() {
  return (
    <Button
      onClick={() => {
        signOut();
      }}
      variant={"outline"}
      className="text-blue-400 hover:text-blue-800 hover:bg-black"
    >
      Logout
    </Button>
  );
}
