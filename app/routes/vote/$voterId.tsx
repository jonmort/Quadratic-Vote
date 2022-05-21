import type { Option, Poll, Vote, Voter } from "@prisma/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import React from "react";
import { db } from "~/utils/prisma.server";
import Voting from "~/components/Voting";
import CurrentStatus from "~/components/CurrentStatus";

export type VoterLoaderData = {
  voter: Voter & {
    votes: Vote[];
    poll: Poll;
  };
  options: (Option & {
    vote: Vote[];
  })[];
};

export const meta: MetaFunction = ({ data }) => ({
  title: `Voting for ${data.voter.poll.title}`,
});

export const loader: LoaderFunction = async ({ params }) => {
  const { voterId } = params;

  const voter = await db.voter.findFirst({
    where: { id: voterId },
    include: { votes: true, poll: true },
  });

  if (!voter) {
    throw new Response("Voter not found", { status: 404 });
  }

  const options = await db.option.findMany({
    where: { pollId: voter.pollId },
    include: { vote: true },
  });

  return { voter, options };
};

const VotingPage = () => {
  const {
    options,
    voter: { credits, poll, name, id, votes },
  } = useLoaderData<VoterLoaderData>();

  return (
    <div className="container p-2 mx-auto">
      <div className="text-center prose">
        <h2 className="my-6 text-3xl">
          Hi <span className="text-accent">{name}</span>
        </h2>
        <h2 className="my-6 text-3xl">
          Voting for{" "}
          <Link
            target="_blank"
            className="font-bold no-underline text-secondary"
            to={`/poll/${poll.id}`}
          >
            {poll.title}
          </Link>
        </h2>
        <p>{poll.description}</p>
      </div>
      <h3 className="text-3xl text-center lg:text-left">
        Remaining Credits: <span className="text-secondary">{credits}</span>
      </h3>
      <div className="mt-8 grid grid-cols-3 gap-8">
        <div className="p-8 rounded bg-secondary3 col-span-3 lg:col-span-1">
          <Voting options={options} votes={votes} voterId={id} />
        </div>
        <div className="relative p-8 rounded bg-secondary3 lg:col-span-2 col-span-3">
          <CurrentStatus options={options} closed />
          <div className="absolute text-right bottom-4 right-4">
            <h3 className="text-xl font-bold">{poll.title}</h3>
            <p className="text-sm">{poll.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotingPage;
