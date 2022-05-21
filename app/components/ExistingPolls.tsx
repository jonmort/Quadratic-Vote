import { useLoaderData } from "@remix-run/react";
import React from "react";
import type { HomeLoaderData } from "~/routes";
import PollItem from "./PollItem";

const ExistingPolls = () => {
  const { polls, username } = useLoaderData<HomeLoaderData>();

  return (
    <div>
      {username ? (
        <h3 className="text-secondary3 text-2xl">Your Existing Polls</h3>
      ) : (
        <div className="bg-secondary3 text-primary rounded p-6">
          <h3 className="text-xl">Login To See Existing Polls</h3>
        </div>
      )}

      <div className="flex flex-col space-y-4 mt-8 max-h-[50vh] overflow-auto hidden-scroll">
        {polls.map((poll) => (
          <PollItem key={poll.id} poll={poll} />
        ))}
      </div>
    </div>
  );
};

export default ExistingPolls;
