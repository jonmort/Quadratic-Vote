import type { Option, Poll, Vote, Voter } from "@prisma/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import React from "react";
import { db } from "~/utils/prisma.server";

type LoaderData = {
  voter: Voter & {
    votes: Vote[];
    poll: Poll;
  };
  options: Option[];
};

export const meta: MetaFunction = ({data}) => ({
  title: `Voting for ${data.voter.poll.title}`
})

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
    voter: { votes, credits, id, poll, name },
  } = useLoaderData<LoaderData>();
  const fetcher = useFetcher();  

  return (
    <div className="container mx-auto text-center">
      <h2 className="text-3xl my-6">Hi <span className="text-teal-500">{name}</span></h2>
      <h2 className="text-3xl my-6">
        Voting for{" "}
        <Link target="_blank" className="text-teal-500 underline" to={`/poll/${poll.id}`}>
          {poll.title}
        </Link>
      </h2>
      <p className="text-2xl">
        Remaining credits: <span className="text-teal-500">{credits}</span>
      </p>
      <div className="bg-red-200 w-full p-4 mt-4" hidden={!fetcher?.data}>
        <h2 className="text-lg">{fetcher?.data}</h2>
      </div>
      <ul className="mt-8">
        {options.map((option) => {
          const myVotes = votes.reduce(
            (acc, val) => (val.optionId === option.id ? acc + 1 : acc),
            0
          );
          const optionId = option.id;

          return (
            <li className="my-8 flex flex-col items-center" key={option.id}>
              <p className="text-xl">
                {option.text} - My votes: {myVotes}
              </p>
              <div className="flex space-x-4 items-center mt-2">
                <fetcher.Form action="/vote/increment" method="post">
                  <input hidden name="optionId" value={optionId} readOnly />
                  <input hidden name="voterId" value={id} readOnly />
                  <button disabled={fetcher.state === 'submitting'} type="submit" className="btn">
                    Add Votes
                  </button>
                </fetcher.Form>
                <fetcher.Form action="/vote/decrement" method="post">
                  <input hidden name="optionId" value={optionId} readOnly />
                  <input hidden name="voterId" value={id} readOnly />
                  <button disabled={fetcher.state === 'submitting'} type="submit" className="btn">
                    Reduce Votes
                  </button>
                </fetcher.Form>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Voting;
