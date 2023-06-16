"use client";

import { useState, useEffect, useRef } from "react";
import { addQuestionAction } from "@/app/_actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

export default function AddQuestion({ params }: { params: { id: string } }) {
  const quizId = params.id;
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState("");
  const [statusColor, setStatusColor] = useState("text-red-500");
  const [optionCount, setOptionCount] = useState(2);
  const [showCheckBoxesOnIndexes, setShowCheckBoxesOnIndexes] = useState(
    new Set<number>()
  );
  const [checkedBoxes, setCheckedBoxes] = useState(new Set<number>());
  const [question, setQuestion] = useState("");

  async function handleSubmit(data: FormData) {
    //remove empty options
    const options = data.getAll("option");
    const filteredOptions = options.filter((option) => option !== "");

    const correctOptionsIndexes = Array.from(checkedBoxes);

    //check if there is a question
    if (!question || typeof question !== "string") {
      setStatusColor("text-red-500");
      setStatus("Question is required");
      //focus on the first input
      formRef.current?.querySelector("input")?.focus();
      return;
    }

    //check if there are at least 2 options
    if (filteredOptions.length < 2) {
      setStatusColor("text-red-500");
      setStatus("At least 2 options are required");
      return;
    }

    //set status to empty and color to green
    setStatus("Successfully created question");
    setStatusColor("text-green-500");

    //reset form
    formRef.current?.reset();

    //change the type of filteredOptions from FormDataEntryValue[] to string[]
    const optionsString = options.map((option) => option.toString());

    setOptionCount(2);
    setShowCheckBoxesOnIndexes(new Set());
    setCheckedBoxes(new Set());
    setQuestion("");

    //call a server action to create a quiz
    const result = await addQuestionAction(
      quizId,
      question,
      optionsString,
      correctOptionsIndexes
    );

    //if there is a message, set status to it, setcolor to red
    if (result.message) {
      setStatus(result.message);
      setStatusColor("text-red-500");
      return;
    }
  }

  return (
    <div className="text-center">
      <div className="mb-28"></div>
      <h1 className="text-4xl font-bold">Add Question</h1>
      <div className="mb-28"></div>
      <div>
        <form
          ref={formRef}
          action={handleSubmit}
          className="flex flex-col items-center  mx-10 sm:mx-20 md:mx-40 lg:mx-60"
        >
          <label className="text-gray-700 font-bold mb-2" htmlFor="question">
            Question
          </label>
          <Input
            autoFocus
            className="rounded py-1 px-2 question"
            type="text"
            name="question"
            value={question}
            onInput={(event) => {
              const value = (event.target as HTMLInputElement).value;
              setQuestion(value);
            }}
          />
          <div className="mb-4"></div>
          <label className="text-gray-700 font-bold mb-2" htmlFor="options">
            Options
          </label>
          <div className="flex flex-col gap-1 mb-1 w-full">
            {Array.from(Array(optionCount).keys()).map((index: number) => (
              <div
                key={index}
                className="flex gap-2 justify-center items-center"
              >
                {showCheckBoxesOnIndexes.has(index) && (
                  <Checkbox
                    name={"correct"}
                    className="checkbox"
                    onCheckedChange={(e) => {
                      if (!e) {
                        setCheckedBoxes((checkedBoxes) => {
                          checkedBoxes.delete(index);
                          return new Set(checkedBoxes);
                        });
                      } else {
                        setCheckedBoxes((checkedBoxes) => {
                          checkedBoxes.add(index);
                          return new Set(checkedBoxes);
                        });
                      }
                    }}
                  />
                )}
                <Input
                  type="text"
                  name="option"
                  autoFocus={index === optionCount - 1 && question !== ""}
                  className="rounded py-1 px-2 input w-full"
                  onInput={(event) => {
                    const value = (event.target as HTMLInputElement).value;
                    if (value === "") {
                      setShowCheckBoxesOnIndexes((showCheckBoxesOnIndexes) => {
                        showCheckBoxesOnIndexes.delete(index);
                        return new Set(showCheckBoxesOnIndexes);
                      });
                    } else {
                      setShowCheckBoxesOnIndexes((showCheckBoxesOnIndexes) => {
                        showCheckBoxesOnIndexes.add(index);
                        return new Set(showCheckBoxesOnIndexes);
                      });
                    }
                  }}
                />
              </div>
            ))}
          </div>
          <Button
            onClick={() => {
              setOptionCount((optionCount) => optionCount + 1);
              //also focus on the newly created input
              //   setTimeout(() => {
              //     const inputs = document.querySelectorAll("input");
              //     const lastInput = inputs[inputs.length - 1];
              //     lastInput.focus();
              //   }, 0);
            }}
            variant="outline"
            type="button"
          >
            Add Option
          </Button>

          <div className="mb-4"></div>
          <Button type="submit">Create</Button>

          {/* show status */}
          <div className={statusColor + " mb-4"}>{status}</div>

          {/* //TODO: add a button to add a new question */}
          <Link href={`/quiz/${quizId}/dashboard`}>
            <Button variant="secondary" type="button">
              Go back to dashboard{" "}
            </Button>
          </Link>
        </form>
      </div>
    </div>
  );
}
