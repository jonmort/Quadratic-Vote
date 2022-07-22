import type { Poll } from "@prisma/client";
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import React from "react";
import JoinForm from "~/components/JoinForm";
import { db } from "~/utils/prisma.server";
import { getUserId, getUserNameByOauthId } from "~/utils/session.server";
import type { RootLoaderData } from "~/root";

export type JoinLoaderData = {
  poll: Poll | null;
  username: string | null;
};

export const meta: MetaFunction = ({ data }) => ({
  title: `Joining Poll ${data?.poll?.title || " "}`,
});

export const loader: LoaderFunction = async ({
  request,
}): Promise<JoinLoaderData> => {
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

  if (poll && userId) {
    const userAlreadyInPoll = (await db.voter.count({ where: { authorId: userId, pollId: pollId } })) > 0
    if (userAlreadyInPoll) throw redirect(`/poll/${pollId}`)
  }

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
  const { poll, username } = useLoaderData<JoinLoaderData>();
  const data = useLoaderData<RootLoaderData>();

  if (!username) {
    return (
      <div className="container max-w-3xl p-4 mx-auto" >
        <div className="w-full prose">
          <div className="my-6 text-center">
            <h1>
              Please login using Google SSO ⤴️
            </h1>
          </div>
        </div>
      </div >
    )
  } else {

    return (
      <div className="container max-w-3xl p-4 mx-auto">
        <div className="w-full prose">
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
          <JoinForm />
        </div>
      </div>
    );
  }
};

export function CatchBoundary() {
  return (
    <div>
      <p>No Poll found</p>
    </div>
  );
}

export default Join;
