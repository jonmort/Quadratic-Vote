import type { Poll } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import React from "react";
import { db } from "~/utils/prisma.server";
import { getUserId, getUserNameByOauthId } from "~/utils/session.server";

type LoaderData = {
  polls: Poll[];
  username: string | null;
};

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData> => {
  const oauthId = await getUserId(request);
  let username: LoaderData["username"] = null;

  let polls: Poll[] = [];

  if (oauthId) {
    polls = await db.poll.findMany({
      where: {
        OR: [
          { authorId: oauthId },
          { voters: { some: { authorId: oauthId } } },
        ],
      },
    });
    username = await getUserNameByOauthId(oauthId);
  }

  return {
    polls,
    username: username ? username?.split(" ")[0] : null,
  };
};

const Home = () => {
  const { polls, username } = useLoaderData<LoaderData>();

  return (
    <div className="container mx-auto">
      <div className="fixed top-0 left-0 bg-primary h-full w-full -z-10" />
      <div className="grid grid-cols-12 gap-2 mt-16">
        <div className="col-span-5">
          <div className="home-image" />
        </div>
        <div className="col-span-7 text-white">
          <div className="text-center">
            <h1 className="text-5xl text-secondary3 font-serif">
              Welcome <span className="text-accent2">{username}</span> to
              Quadratic Voting!
            </h1>
            <p className="mt-9">
              This is a simple website that provides a simple way to create
              quadratic polls.
            </p>
          </div>
          <div className="flex justify-between mt-[8vw]">
            <div className="basis-2/5 max-h-[50vh] overflow-auto">
              {username ? (
                <h3 className="text-secondary3 text-2xl">
                  Your Existing Polls
                </h3>
              ) : (
                <div className="bg-secondary3 text-primary rounded p-6">
                  <h3 className="text-xl">Login To See Existing Polls</h3>
                </div>
              )}

              <div className="flex flex-col space-y-4 mt-8">
                {polls.map((poll) => (
                  <Link
                    to={`/poll/${poll.id}`}
                    className="bg-secondary3 text-primary rounded p-6 hover:underline"
                    key={poll.id}
                  >
                    <h3 className="text-xl font-bold ">{poll.title}</h3>
                    <p className="mt-4">
                      {poll.description || "No description"}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex-grow ml-[10vw]">
              <Form className="flex pb-4" action="/join" method="get">
                <div className="flex flex-col w-full">
                  <input
                    className="input mb-4"
                    type="text"
                    name="pollId"
                    placeholder="Poll ID"
                  />
                  <button type="submit" className="btn bg-accent3 uppercase">
                    Join A poll
                  </button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
