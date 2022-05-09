import type { Poll } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import React from "react";
import { db } from "~/utils/prisma.server";

type LoaderData = {
  poll: Poll;
} | null;

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const pollId = url.searchParams.get("pollId");

  if (!pollId) {
    return null;
  }

  const poll = await db.poll.findFirst({
    where: { id: pollId },
  });

  if (!poll) return redirect("/join");

  return {
    poll,
  };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const formValues = Object.fromEntries(formData.entries());

  const poll = await db.poll.findFirst({
    where: { id: formValues.pollId as string },
    select: { initialCredits: true },
  });

  const newVoter = await db.voter.create({
    data: {
      pollId: formValues.pollId as string,
      name: formValues.name as string,
      credits: poll!.initialCredits,
    },
  });

  return redirect(`/vote/${newVoter.id}`);
};

const Join = () => {
  const loaderData = useLoaderData<LoaderData>();

  return (
    <div className="container mx-auto text-center">
      {loaderData ? (
        <h1 className="text-3xl my-6">
          Joining <span className="text-teal-500">{loaderData.poll.title}</span>
        </h1>
      ) : null}
      <Form
        className="flex flex-col items-center mt-8 space-y-4"
        action="/join"
        method="post"
      >
        <div className="input-group">
          <label className="input-label" htmlFor="name">
            Your Name
          </label>
          <input className="input" type="text" name="name" placeholder="Name" />
        </div>

        <div className="input-group" hidden={!!loaderData}>
          {!loaderData && (
            <label className="input-label" htmlFor="pollId">
              Poll ID
            </label>
          )}
          <input
            hidden={!!loaderData}
            className="input"
            name="pollId"
            defaultValue={loaderData?.poll?.id}
            placeholder="Poll ID"
          />
        </div>

        <button className="btn mt-4" type="submit">
          Join
        </button>
      </Form>
    </div>
  );
};

export function CatchBoundary() {
  return (
    <div>
      <p>No Poll found</p>
    </div>
  );
}

export default Join;
