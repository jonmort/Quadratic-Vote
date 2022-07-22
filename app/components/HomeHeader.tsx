import { useLoaderData } from "@remix-run/react";
import React from "react";
import type { HomeLoaderData } from "~/routes";

const HomeHeader = () => {
  const { username } = useLoaderData<HomeLoaderData>();
  return (
    <div className="text-center">
      <h1 className="font-serif text-5xl text-secondary3">
        Welcome <span className="text-accent2">{username}</span> to HackDay
        Voting!
      </h1>
      <p className="mt-9">
        Voting for HackDay starts here. We're using Quadratic Voting this year to determine the winners.
      </p>
    </div>
  );
};

export default HomeHeader;
