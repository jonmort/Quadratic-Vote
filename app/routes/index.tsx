import type { Poll } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import React from "react";
import ExistingPolls from "~/components/ExistingPolls";
import HomeHeader from "~/components/HomeHeader";
import RedirectJoinForm from "~/components/RedirectJoinForm";
import { db } from "~/utils/prisma.server";
import { getUserId, getUserNameByOauthId } from "~/utils/session.server";

export type HomeLoaderData = {
  polls: Poll[];
  username: string | null;
};

export const loader: LoaderFunction = async ({
  request,
}): Promise<HomeLoaderData> => {
  const oauthId = await getUserId(request);
  let username: HomeLoaderData["username"] = null;

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
  return (
    <div className="container mx-auto p-2">
      <div className="fixed top-0 left-0 bg-primary h-full w-full -z-10" />
      <div className="grid grid-cols-12 gap-2 mt-[5vh] z-20">
        <div className="col-span-5 -z-10">
          <div className="home-image" />
        </div>
        <div className="lg:col-span-7 col-span-12 text-white">
          <HomeHeader />
          <div className="flex justify-between mt-[10vh] flex-wrap">
            <div className="flex-grow md:ml-[10vw] md:order-2 md:mt-16">
              <RedirectJoinForm />
            </div>
            <div className="md:order-1 md:basis-2/5 basis-full">
              <ExistingPolls />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
