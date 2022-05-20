import type { Poll } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData, useTransition } from "@remix-run/react";
import React from "react";
import { db } from "~/utils/prisma.server";
import { getUserId, getUserNameByOauthId } from "~/utils/session.server";

type LoaderData = {
  poll: Poll | null;
  username: string | null;
};

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData> => {
  const userId = await getUserId(request);
  let username = null;
  let poll: Poll | null = null;

  if (userId) {
    username = await getUserNameByOauthId(userId);
  }

  const url = new URL(request.url);
  const pollId = url.searchParams.get("pollId");

  if (!pollId) return { poll, username };

  poll = await db.poll.findFirst({
    where: { id: pollId },
  });

  if (!poll) throw redirect("/join");

  return {
    poll,
    username,
  };
};

export const action: ActionFunction = async ({ request }) => {
  const authorId = await getUserId(request);
  const formData = await request.formData();
  const formValues = Object.fromEntries(formData.entries());
  const pollId = formValues.pollId as string;
  let name = formValues.name as string;

  if (authorId) {
    name = await getUserNameByOauthId(authorId);
  }

  const poll = await db.poll.findFirst({
    where: { id: pollId },
    select: { initialCredits: true },
  });

  const newVoter = await db.voter.create({
    data: {
      pollId,
      name,
      credits: poll!.initialCredits,
      authorId,
    },
  });

  return redirect(`/vote/${newVoter.id}`);
};

const Join = () => {
  const { poll, username } = useLoaderData<LoaderData>();
  const transition = useTransition();

  return (
    <div className="container  max-w-3xl mx-auto">
      <div className="prose w-full">
        <div className="my-6 text-center">
          {username && (
            <h1>
              Hi <span className="text-primary3">{username}</span>
            </h1>
          )}
          <h1>
            {poll ? (
              <span>
                Joining Poll <span className="text-primary3">{poll.title}</span>
              </span>
            ) : (
              <span>Please fill in the form.</span>
            )}
          </h1>
        </div>
        <Form
          className="flex flex-col space-y-4"
          action="/join"
          method="post"
        >
          <div className="form-control">
            {!username && (
              <label className="label" htmlFor="name">
                Your Name
              </label>
            )}
            <input
              hidden={!!username}
              defaultValue={username || ""}
              className="input"
              type="text"
              name="name"
              placeholder="Name"
            />
          </div>

          <div className="form-control" hidden={!!poll}>
            {!poll && (
              <label className="label" htmlFor="pollId">
                Poll ID
              </label>
            )}
            <input
              hidden={!!poll}
              className="input"
              name="pollId"
              defaultValue={poll?.id}
              placeholder="Poll ID"
            />
          </div>

          <button
            className="btn bg-accent2 mt-4 uppercase"
            type="submit"
            disabled={transition.state === "submitting"}
          >
            Join
          </button>
        </Form>
      </div>
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
