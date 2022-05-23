import type { ActionFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import React, { useState } from "react";
import * as Yup from "yup";
import { db } from "~/utils/prisma.server";
import { getUserId, getUserNameByOauthId } from "~/utils/session.server";

type ActionData = {
  fieldErrors?: {
    [k: string]: string;
  };
  error?: string;
};

const createFormSchema = Yup.object({
  title: Yup.string().required().label("Title"),
  description: Yup.string().label("Description"),
  initialCredits: Yup.number()
    .required("Initial Credits is required")
    .min(0)
    .integer("Initial Credits should be an integer")
    .label("Initial Credits"),
  questions: Yup.array().of(Yup.string().required()).min(2).label("Questions"),
});

export const meta: MetaFunction = () => ({
  title: "Create A New Poll",
});

export const action: ActionFunction = async ({ request }) => {
  const authorId = await getUserId(request);
  const formData = await request.formData();

  const formValues = {
    title: formData.get("title"),
    description: formData.get("description"),
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
        description: validatedValues.description || null,
        authorId,
        options: {
          create: validatedValues.questions?.map((question) => ({
            text: question,
          })),
        },
      },
    });

    if (authorId) {
      const name = await getUserNameByOauthId(authorId)
      await db.voter.create({
        data: {
          pollId: newPoll.id,
          name,
          authorId,
          credits: newPoll!.initialCredits,
        },
      });
    }

    return redirect(`/poll/${newPoll.id}`);
  } catch (err: any) {
    if (err instanceof Yup.ValidationError) {
      let fieldErrors: { [k: string]: string } = {};
      err.inner.forEach((inner) => {
        fieldErrors[inner.path || inner.name] = inner.message;
      });
      return json({ fieldErrors });
    } else {
      console.log(err);

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
      className="container flex flex-col max-w-3xl p-4 pb-4 mx-auto space-y-4"
      method="post"
      action="/create"
    >
      <div className="w-full prose prose-p:mb-0">
        <h1 className="my-8 text-center capitalize">Create a New Poll</h1>
        <div className="w-full p-4 bg-red-300" hidden={!actionData?.error}>
          <h2>{actionData?.error}</h2>
        </div>
        <div className="form-control">
          <label htmlFor="title" className="label">
            Title
          </label>
          <input className="input" type="text" name="title" required />
          <p
            className="mt-0 text-red-500 label label-text-alt"
            hidden={!actionData?.fieldErrors?.title}
          >
            {actionData?.fieldErrors?.title}
          </p>
        </div>
        <div className="form-control">
          <label htmlFor="description" className="label">
            Description
          </label>
          <textarea className="input" name="description" />
          <p
            className="mt-0 text-red-500 label label-text-alt"
            hidden={!actionData?.fieldErrors?.description}
          >
            {actionData?.fieldErrors?.description}
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
            className="mt-0 text-red-500 label label-text-alt"
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
              className="mt-0 text-red-500 label label-text-alt"
              hidden={!actionData?.fieldErrors?.questions}
            >
              {actionData?.fieldErrors?.questions}
            </p>
          </div>
        ))}
        <div className="flex space-x-2">
          <button
            className="flex-grow uppercase btn bg-primary text-secondary3"
            onClick={addQuestion}
          >
            Add Question
          </button>
          <button
            className="flex-grow uppercase btn bg-primary text-secondary3"
            onClick={removeQuestion}
            hidden={questionCount < 2}
          >
            Remove Question
          </button>
        </div>

        <button className="w-full mt-4 uppercase btn bg-accent2" type="submit">
          Create Poll
        </button>
      </div>
    </Form>
  );
};

export default CreatePoll;
