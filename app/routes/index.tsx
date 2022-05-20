import type { Poll } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import React from "react";
import { db } from "~/utils/prisma.server";
import { getUserId } from "~/utils/session.server";

type LoaderData = {
  polls: Poll[];
};

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData> => {
  const oauthId = await getUserId(request);

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
  }

  return {
    polls,
  };
};

const Home = () => {
  const { polls } = useLoaderData<LoaderData>();

  return (
    <div className="container mx-auto text-center prose">
      <div className="lg:mt-[20vh] mt-4 mx-4 lg:mx-0">
        <h1>Welcome to Quadratic Voting</h1>
        <p className="mt-4">
          This is a simple website that provides a simple way to create
          quadratic polls.
        </p>
        <div className="flex mt-16 mx-auto justify-between min-h-[20vh] text-left lg:flex-row flex-col">
          <div className="card bg-base-300 flex-grow lg:w-1/2">
            <div className="card-body">
              <h2 className="card-title mt-0 text-center">
                Your Existing Polls
              </h2>
              <div>
                <ul className="pl-4 prose-a:no-underline text-lg text-primary">
                  {polls.map((poll) => (
                    <li key={poll.id}>
                      <Link to={`/poll/${poll.id}`}>{poll.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="divider divider-horizontal"></div>
          <div className="card bg-base-300 flex-grow lg:w-1/2 lg:mt-0 mt-4">
            <div className="card-body">
              <h2 className="card-title mt-0 text-center">New Poll</h2>
              <div className="card-actions">
                <div>
                  <Link className="btn" to="/create">
                    Create a new poll
                  </Link>
                  <div className="divider"></div>
                  <Form action="/join" method="get">
                    <div className="flex flex-col">
                      <input
                        className="input mb-4"
                        type="text"
                        name="pollId"
                        placeholder="Poll ID"
                      />
                      <button type="submit" className="btn">
                        Join A poll
                      </button>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
