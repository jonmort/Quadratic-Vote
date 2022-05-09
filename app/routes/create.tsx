import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import React, { useState } from "react";
import * as Yup from "yup";
import { db } from "~/utils/prisma.server";

type ActionData = {
  fieldErrors?: {
    [k: string]: string;
  };
  error?: string;
};

const createFormSchema = Yup.object({
  title: Yup.string().required().label("Title"),
  initialCredits: Yup.number()
    .required("Initial Credits is required")
    .integer("Initial Credits should be an integer"),
  questions: Yup.array().of(Yup.string().required()).min(2).label("Questions"),
});

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const formValues = {
    title: formData.get("title"),
    initialCredits: formData.get("initialCredits"),
    questions: formData.getAll("questions"),
  };

  try {
    const validatedValues = await createFormSchema.validate(formValues, {
      abortEarly: false,
    });
    const newPoll = await db.poll.create({
      data: {
        title: validatedValues.title,
        initialCredits: validatedValues.initialCredits,
        options: {
          create: validatedValues.questions?.map((question) => ({
            text: question,
          })),
        },
      },
    });

    return redirect(`/poll/${newPoll.id}`);
  } catch (err: any) {
    if (err instanceof Yup.ValidationError) {
      let fieldErrors: { [k: string]: string } = {};
      err.inner.forEach((inner) => {
        fieldErrors[inner.path || inner.name] = inner.message;
      });
      return json({ fieldErrors });
    } else {
      return json({ error: "Unknown Error." });
    }
  }
};

const CreatePoll = () => {
  const actionData = useActionData<ActionData>();
  const [questionCount, setQuestionCount] = useState(4);

  const addQuestion = () => setQuestionCount((r) => r + 1);

  const removeQuestion = () => setQuestionCount((r) => r - 1);

  return (
    <Form
      className="container mx-auto text-center flex flex-col items-center space-y-4"
      method="post"
      action="/create"
    >
      <h1 className="text-4xl my-16">Create a New Poll</h1>
      <div className="bg-red-200 w-full p-4" hidden={!actionData?.error}>
        <h2 className="text-lg">{actionData?.error}</h2>
      </div>
      <div className="input-group">
        <label htmlFor="title" className="input-label">
          Title
        </label>
        <input className="input" type="text" name="title" />
        <p className="error-text" hidden={!actionData?.fieldErrors?.title}>
          {actionData?.fieldErrors?.title}
        </p>
      </div>
      <div className="input-group">
        <label className="input-label" htmlFor="initialCredits">
          Initial Credits:
        </label>
        <input className="input" type="number" name="initialCredits" required />
        <p
          className="error-text"
          hidden={!actionData?.fieldErrors?.initialCredits}
        >
          {actionData?.fieldErrors?.initialCredits}
        </p>
      </div>
      {[...Array(questionCount)].map((_, i) => (
        <div key={i} className="input-group">
          <label className="input-label" htmlFor="questions">
            Question {i + 1}:
          </label>
          <input className="input" name="questions" />
          <p
            className="error-text"
            hidden={!actionData?.fieldErrors?.questions}
          >
            {actionData?.fieldErrors?.questions}
          </p>
        </div>
      ))}
      <div className="flex space-x-2 justify-start">
        <button className="btn" onClick={addQuestion}>Add Question</button>
        <button className="btn" onClick={removeQuestion} hidden={questionCount < 2}>
          Remove Question
        </button>
      </div>

      <button className="btn" type="submit">
        Submit
      </button>
    </Form>
  );
};

export default CreatePoll;
