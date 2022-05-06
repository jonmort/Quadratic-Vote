import type { Option, Poll, Vote, Voter } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import React from "react";
import { db } from "~/utils/prisma.server";

type LoaderData = {
  voter: Voter & {
    votes: Vote[];
    poll: Poll
  };
  options: Option[];
};

export const loader: LoaderFunction = async ({ params }) => {
  const { voterId } = params;

  const voter = await db.voter.findFirst({
    where: { id: voterId },
    include: { votes: true, poll: true },
  });

  if (!voter) {
    throw new Response("Voter not found", { status: 404 });
  }

  const options = await db.option.findMany({ where: { pollId: voter.pollId } });

  return { voter, options };
};

const Voting = () => {
  const {
    options,
    voter: { votes, credits, id, poll },
  } = useLoaderData<LoaderData>();
  const fetcher = useFetcher();

  return (
    <div>
      <h1>Please vote</h1>
      <h2>Voting for <Link className="text-blue-500" to={`/poll/${poll.id}`}>{poll.title}</Link></h2>
      <p>Remaining credits: {credits}</p>
      <ul>
        {options.map((option) => {
          const myVotes = votes.reduce(
            (acc, val) => (val.optionId === option.id ? acc + 1 : acc),
            0
          );
          const optionId = option.id;

          return (
            <li className="my-4" key={option.id}>
              <p>
                {option.text} - My votes: {myVotes}
              </p>
              <fetcher.Form action="/vote/increment" method="post">
                <input hidden name="optionId" value={optionId} readOnly />
                <input hidden name="voterId" value={id} readOnly />
                <button
                  type="submit"
                  className="border-2 border-black mx-2 px-2"
                >
                  Add Votes
                </button>
              </fetcher.Form>
              <fetcher.Form action="/vote/decrement" method="post">
                <input hidden name="optionId" value={optionId} readOnly />
                <input hidden name="voterId" value={id} readOnly />
                <button
                  type="submit"
                  className="border-2 border-black mx-2 px-2"
                >
                  Reduce Votes
                </button>
              </fetcher.Form>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Voting;
