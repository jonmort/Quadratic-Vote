import type { Option, Poll, Vote, Voter } from "@prisma/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import React from "react";
import CurrentStatus from "~/components/CurrentStatus";
import PollShare from "~/components/PollShare";
import Voters from "~/components/Voters";
import { db } from "~/utils/prisma.server";
import { getUserId } from "~/utils/session.server";

export type PollLoaderData = {
  poll: Poll;
  options: (Option & {
    vote: Vote[];
  })[];
  voters: (Voter & {
    votes: Vote[];
  })[];
  currentUrl: string;
  myVotePageId?: string;
};

export const meta: MetaFunction = ({ data }) => ({
  title: `Poll: ${data?.poll?.title}`,
});

export const loader: LoaderFunction = async ({
  params,
  request,
}): Promise<PollLoaderData> => {
  const oauthId = await getUserId(request);
  let myVotePageId: string | undefined = undefined;
  const poll = await db.poll.findFirst({
    where: { id: params.pollId },
  });

  if (!poll) {
    throw new Response("Poll Not found", { status: 404 });
  }

  const voters = await db.voter.findMany({
    where: { pollId: poll.id },
    include: { votes: true },
  });

  const options = await db.option.findMany({
    where: { pollId: params.pollId },
    include: { vote: true },
    orderBy: { vote: { _count: "desc" } },
  });

  if (oauthId) {
    myVotePageId = voters.find((voter) => voter.authorId === oauthId)?.id;
  }

  return { poll, voters, options, currentUrl: request.url, myVotePageId };
};

const PollDetails = () => {
  const { poll, options, myVotePageId } = useLoaderData<PollLoaderData>();

  return (
    <div className="mx-auto container p-4">
      <div className="prose">
        <h1 className="my-8 text-secondary text-center">{poll.title}</h1>
        <PollShare />
      </div>
      <div className="grid grid-cols-12 min-h-[50vh] mt-[5vh]">
        <div className="lg:col-span-6 col-span-12">
          <CurrentStatus options={options} />
        </div>
        <div className="flex flex-col lg:col-span-6 col-span-12 prose prose-p:m-0 prose-h3:m-0 prose-table:m-0">
          <p>{poll.description}</p>
          <Link
            className="btn bg-accent3 block mt-4 no-underline text-center uppercase lg:order-2"
            to={`/vote/${myVotePageId}`}
          >
            My Vote Page For {poll.title}
          </Link>
          <Voters />
        </div>
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

export default PollDetails;
