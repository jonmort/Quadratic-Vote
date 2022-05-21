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
    <div className="container mx-auto p-2">
      <div className="prose text-center">
        <h2 className="text-3xl my-6">
          Hi <span className="text-accent">{name}</span>
        </h2>
        <h2 className="text-3xl my-6">
          Voting for{" "}
          <Link
            target="_blank"
            className="text-secondary no-underline font-bold"
            to={`/poll/${poll.id}`}
          >
            {poll.title}
          </Link>
        </h2>
        <p>{poll.description}</p>
      </div>
      <h3 className="text-3xl lg:text-left text-center">
        Remaining Credits: <span className="text-secondary">{credits}</span>
      </h3>
      <div className="grid grid-cols-3 mt-8 gap-8">
        <div className="p-8 bg-secondary3 rounded col-span-3 lg:col-span-1">
          <Voting options={options} votes={votes} voterId={id} />
        </div>
        <div className="p-8 bg-secondary3 lg:col-span-2 col-span-3 rounded relative">
          <CurrentStatus options={options} closed />
          <div className="absolute bottom-4 right-4 text-right">
            <h3 className="text-xl font-bold">{poll.title}</h3>
            <p className="text-sm">{poll.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotingPage;
