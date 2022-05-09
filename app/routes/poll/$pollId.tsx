import type { Option, Poll, Vote, Voter } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import React from "react";
import { db } from "~/utils/prisma.server";

type LoaderData = {
  poll: Poll;
  options: Option[];
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
    orderBy: { vote: { _count: "desc" } },
  });

  const questions = options.sort().map((option) => ({
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
    <div className="mx-auto container text-center">
      <h1 className="my-8 text-3xl text-teal-500">{poll.title}</h1>
      <div className="my-4">
        <h2 className="text-xl">Current Votes</h2>
        <ul className="mt-2">
          {questions.map((q) => (
            <li key={q.question}>
              {q.question} - <span className="text-teal-700">Votes: {q.votes}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="my-4">
        <h2 className="text-xl">Voters</h2>
        <ul className="mt-2">
          {voters.map((v) => (
            <li key={v.id}>
              {v.name} - <span className="text-teal-700">Credits remaining: {v.credits}</span>
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
