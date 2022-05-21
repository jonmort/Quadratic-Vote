import type { Option, Vote } from "@prisma/client";
import { useFetcher } from "@remix-run/react";
import React from "react";

type VotingProps = {
  options: Option[];
  votes: Vote[];
  voterId: string;
};

const Voting: React.FC<VotingProps> = ({ options, votes, voterId }) => {
  const fetcher = useFetcher();

  return (
    <>
      <div className="w-full p-4 mt-4 bg-error" hidden={!fetcher?.data}>
        <h2 className="text-lg">{fetcher?.data}</h2>
      </div>
      <ul>
        {options.map((option) => {
          const myVotes = votes.reduce(
            (acc, val) => (val.optionId === option.id ? acc + 1 : acc),
            0
          );
          const optionId = option.id;

          return (
            <li className="flex flex-col my-8" key={option.id}>
              <h4 className="text-2xl">{option.text}</h4>
              <div className="flex items-center justify-between mt-4 space-x-4">
                <fetcher.Form action="/vote/decrement" method="post">
                  <input hidden name="optionId" value={optionId} readOnly />
                  <input hidden name="voterId" value={voterId} readOnly />
                  <button
                    disabled={fetcher.state === "submitting"}
                    type="submit"
                    className="relative w-8 h-8 p-0 btn bg-accent3"
                  >
                    <span className="absolute text-2xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      -
                    </span>
                  </button>
                </fetcher.Form>
                <h4 className="my-0 text-xl">
                  Current Votes: <span className="text-secondary">{myVotes}</span>
                </h4>
                <fetcher.Form action="/vote/increment" method="post">
                  <input hidden name="optionId" value={optionId} readOnly />
                  <input hidden name="voterId" value={voterId} readOnly />
                  <button
                    disabled={fetcher.state === "submitting"}
                    type="submit"
                    className="relative w-8 h-8 p-0 btn bg-accent3"
                  >
                    <span className="absolute text-2xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      +
                    </span>
                  </button>
                </fetcher.Form>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default Voting;
