import type { Option, Poll, Vote, Voter } from "@prisma/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import React from "react";
import CurrentStatus from "~/components/CurrentStatus";
import { db } from "~/utils/prisma.server";

type LoaderData = {
  poll: Poll;
  options: (Option & {
    vote: Vote[];
  })[];
  voters: (Voter & {
    votes: Vote[];
  })[];
};

export const meta: MetaFunction = ({ data }) => ({
  title: `Poll: ${data?.poll?.title}`,
});

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
    include: { vote: true },
    orderBy: { vote: { _count: "desc" } },
  });

  return { poll, voters, options };
};

const PollDetails = () => {
  const { poll, voters, options } = useLoaderData<LoaderData>();

  return (
    <div className="mx-auto container prose">
      <h1 className="my-8 text-primary">{poll.title}</h1>
      <div className="grid grid-cols-4 min-h-[50vh]">
        <div className="col-span-3">
          <CurrentStatus options={options} />
        </div>
        <div className="card">
          <div className="card-body">
            <h2 className="card-title">Voters</h2>
            <ul className="mt-2">
              {voters.map((v) => (
                <li key={v.id}>
                  <Link className="underline text-primary" to={`/vote/${v.id}`}>
                    {v.name}
                  </Link>{" "}
                  <p className="text-secondary text-xs mt-0">
                    Credits remaining: {v.credits}
                  </p>
                </li>
              ))}
            </ul>
          </div>
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
