import type { Option, Poll, Vote, Voter } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import React from "react";
import { db } from "~/utils/prisma.server";

type LoaderData = {
  poll: Poll & {
    options: Option[];
  };
  voters: (Voter & {
    votes: Vote[];
  })[];
  questions: {
    question: string;
    votes: number;
  }[];
};

export const loader: LoaderFunction = async ({ params }) => {
  const poll = await db.poll.findFirst({
    where: { id: params.pollId },
    include: { options: true },
  });

  if (!poll) {
    throw new Response("Poll Not found", { status: 404 });
  }

  const voters = await db.voter.findMany({
    where: { pollId: poll.id },
    include: { votes: true },
  });

  const questions = poll.options.map((option) => ({
    question: option.text,
    votes: voters.reduce((prev, current) => {
      const votesFor = current.votes.filter(
        (vote) => vote.optionId === option.id
      ).length;
      return votesFor > 0 ? prev + votesFor : prev;
    }, 0),
  }));

  return { poll, voters, questions };
};

const PollDetails = () => {
  const { poll, questions, voters } = useLoaderData<LoaderData>();

  return (
    <div>
      <h1>{poll.title}</h1>
      <div className="my-4">
        <h2>Questions</h2>
        <ul>
          {questions.map((q) => (
            <li key={q.question}>
              {q.question} - Votes: {q.votes}
            </li>
          ))}
        </ul>
      </div>
      <div className="my-4">
        <h2>Voters</h2>
        <ul>
          {voters.map((v) => (
            <li key={v.id}>
              {v.name} - {v.votes.length > 0 ? "Voted" : "Not Voted"}
            </li>
          ))}
        </ul>
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
