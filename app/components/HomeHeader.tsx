import { useLoaderData } from "@remix-run/react";
import React from "react";
import type { HomeLoaderData } from "~/routes";

const HomeHeader = () => {
  const { username } = useLoaderData<HomeLoaderData>();
  return (
    <div className="text-center">
      <h1 className="text-5xl text-secondary3 font-serif">
        Welcome <span className="text-accent2">{username}</span> to Quadratic
        Voting!
      </h1>
      <p className="mt-9">
        This is a simple website that provides a simple way to create quadratic
        polls.
      </p>
    </div>
  );
};

export default HomeHeader;
