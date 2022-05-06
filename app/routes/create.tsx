import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import React from "react";
import * as Yup from "yup";
import { db } from "~/utils/prisma.server";

type ActionData = {
  fieldErrors?: {
    field: string;
    message: string;
  }[];
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
      return json({
        fieldErrors: err.inner.map((inner) => ({
          field: inner.path || inner.name,
          message: inner.message,
        })),
      });
    } else {
      return json({ error: "Unknown Error." });
    }
  }
};

const CreatePoll = () => {
  const actionData = useActionData<ActionData>();

  console.log({ actionData });

  return (
    <Form className="p-4" method="post" action="/create">
      <div>
        <label htmlFor="title">Title:</label>
        <input className="ml-2 border-2 px-2" type="text" name="title" />
      </div>
      <div className="my-2">
        <label htmlFor="initialCredits">Initial Credits:</label>
        <input
          className="ml-2 border-2 px-2"
          type="number"
          name="initialCredits"
          required
        />
      </div>
      <div>
        <label htmlFor="questions">Question1:</label>
        <input className="ml-2 border-2 px-2" name="questions" />
      </div>
      <div>
        <label htmlFor="questions">Question2:</label>
        <input className="ml-2 border-2 px-2" name="questions" />
      </div>
      <button className="bg-gray-200 p-2 my-2" type="submit">
        Submit
      </button>
    </Form>
  );
};

export default CreatePoll;
