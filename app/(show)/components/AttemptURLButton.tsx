"use client";

import { Button } from "@/components/ui/button";
export default function AttemptURLButton({
  attemptURL,
}: {
  attemptURL: string;
}) {
  return (
    <Button
      onClick={() => {
        navigator.clipboard.writeText(attemptURL);
      }}
      variant={"outline"}
      className="text-blue-400 hover:text-blue-800 hover:bg-black"
    >
      Copy
    </Button>
  );
}
