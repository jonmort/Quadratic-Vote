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
      <div className="bg-error w-full p-4 mt-4" hidden={!fetcher?.data}>
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
            <li
              className="my-8 flex flex-col prose prose-p:m-0"
              key={option.id}
            >
              <h4 className="text-xl">{option.text}</h4>
              <div className="flex space-x-4 items-center mt-2">
                <fetcher.Form action="/vote/decrement" method="post">
                  <input hidden name="optionId" value={optionId} readOnly />
                  <input hidden name="voterId" value={voterId} readOnly />
                  <button
                    disabled={fetcher.state === "submitting"}
                    type="submit"
                    className="btn btn-sm btn-secondary"
                  >
                    -
                  </button>
                </fetcher.Form>
                <h4 className="my-0">Current Votes: <span className="text-primary">{myVotes}</span></h4>
                <fetcher.Form action="/vote/increment" method="post">
                  <input hidden name="optionId" value={optionId} readOnly />
                  <input hidden name="voterId" value={voterId} readOnly />
                  <button
                    disabled={fetcher.state === "submitting"}
                    type="submit"
                    className="btn btn-sm btn-secondary"
                  >
                    +
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
