import type { Poll } from "@prisma/client";
import { Link } from "@remix-run/react";
import React from "react";

type PollItemProps = {
  poll: Poll;
};

const PollItem: React.FC<PollItemProps> = ({ poll }) => {
  return (
    <Link
      to={`/poll/${poll.id}`}
      className="p-6 rounded bg-secondary3 text-primary hover:underline"
      key={poll.id}
    >
      <h3 className="text-xl font-bold ">{poll.title}</h3>
      <p className="mt-4">{poll.description || "No description"}</p>
    </Link>
  );
};

export default PollItem;
