import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import React, { useState } from "react";
import * as Yup from "yup";
import { db } from "~/utils/prisma.server";
import { getUserId } from "~/utils/session.server";

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
    .min(0)
    .integer("Initial Credits should be an integer")
    .label('Initial Credits'),
  questions: Yup.array().of(Yup.string().required()).min(2).label("Questions"),
});

export const action: ActionFunction = async ({ request }) => {
  const authorId = await getUserId(request)
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
        authorId,
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
      className="container max-w-3xl mx-auto flex flex-col pb-4 space-y-4"
      method="post"
      action="/create"
    >
      <div className="prose w-full prose-p:mb-0">
        <h1 className="my-8 capitalize text-center">Create a New Poll</h1>
        <div className="bg-red-300 w-full p-4" hidden={!actionData?.error}>
          <h2>{actionData?.error}</h2>
        </div>
        <div className="form-control">
          <label htmlFor="title" className="label">
            Title
          </label>
          <input className="input" type="text" name="title" />
          <p
            className="label label-text-alt mt-0 text-red-500"
            hidden={!actionData?.fieldErrors?.title}
          >
            {actionData?.fieldErrors?.title}
          </p>
        </div>
        <div className="form-control">
          <label className="label" htmlFor="initialCredits">
            Initial Credits:
          </label>
          <input
            className="input"
            type="number"
            name="initialCredits"
            required
          />
          <p
            className="label label-text-alt mt-0 text-red-500"
            hidden={!actionData?.fieldErrors?.initialCredits}
          >
            {actionData?.fieldErrors?.initialCredits}
          </p>
        </div>
        {[...Array(questionCount)].map((_, i) => (
          <div key={i} className="form-control">
            <label className="label" htmlFor="questions">
              Question {i + 1}:
            </label>
            <input className="input" name="questions" />
            <p
              className="label label-text-alt mt-0 text-red-500"
              hidden={!actionData?.fieldErrors?.questions}
            >
              {actionData?.fieldErrors?.questions}
            </p>
          </div>
        ))}
        <div className="flex space-x-2">
          <button className="btn bg-primary text-secondary3 flex-grow uppercase" onClick={addQuestion}>
            Add Question
          </button>
          <button
            className="btn bg-primary text-secondary3 flex-grow uppercase"
            onClick={removeQuestion}
            hidden={questionCount < 2}
          >
            Remove Question
          </button>
        </div>

        <button className="btn bg-accent2 uppercase mt-4 w-full" type="submit">
          Create Poll
        </button>
      </div>
    </Form>
  );
};

export default CreatePoll;
