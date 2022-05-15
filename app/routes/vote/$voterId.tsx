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
    <div className="container mx-auto">
      <div className="prose">
        <h2 className="text-3xl my-6">
          Hi <span className="text-primary">{name}</span>
        </h2>
        <h2 className="text-3xl my-6">
          Voting for{" "}
          <Link
            target="_blank"
            className="text-secondary underline"
            to={`/poll/${poll.id}`}
          >
            {poll.title}
          </Link>
        </h2>
        <p className="text-2xl">
          Remaining credits: <span className="text-primary font-bold">{credits}</span>
        </p>
      </div>
      <div className="flex mt-8 space-x-4">
        <div className="card bg-base-300">
          <div className="card-body">
            <h2 className="card-title">Voting</h2>
            <Voting options={options} votes={votes} voterId={id} />
          </div>
        </div>
        <div className="card bg-base-300 flex-grow">
          <div className="card-body">
            <h2 className="card-title">Current Status</h2>
            <CurrentStatus options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotingPage;
