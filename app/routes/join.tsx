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

  const poll = await db.poll.findFirst({where: {id: formValues.pollId as string}, select: {initialCredits: true}})

  const newVoter = await db.voter.create({
    data: {
      pollId: formValues.pollId as string,
      name: formValues.name as string,
      credits: poll!.initialCredits
    },
  });

  return redirect(`/vote/${newVoter.id}`);
};

const Join = () => {
  const loaderData = useLoaderData<LoaderData>();

  return (
    <div>
      {loaderData ? <h1>About to join {loaderData.poll.title}</h1> : null}
      <p>Please enter your name</p>
      <Form action="/join" method="post">
        <label htmlFor="name"></label>
        <input type="text" name="name" placeholder="name" />
        <input
          name="pollId"
          defaultValue={loaderData?.poll.id}
          hidden={!!loaderData}
          placeholder="pollId"
        />
        <button type="submit">submit</button>
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
