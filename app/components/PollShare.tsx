import { useLoaderData } from "@remix-run/react";
import React, { useState } from "react";
import type { PollLoaderData } from "~/routes/poll/$pollId";

const PollShare = () => {
  const [displayState, setDisplayState] = useState(false);
  const { currentUrl } = useLoaderData<PollLoaderData>();

  const onClick = () => {
    navigator.clipboard.writeText(currentUrl);
    setDisplayState(true);
    setTimeout(() => setDisplayState(false), 2000);
  };

  return (
    <div className="flex rounded">
      <button
        onClick={onClick}
        className="relative rounded flex justify-between bg-accent3 hover:bg-accent2 active:bg-accent transition-colors mx-auto min-w-[400px]"
      >
        <p className="m-0 py-3 px-4">{currentUrl}</p>
        <div className="flex items-center py-3 px-4">
          <span className="h-full w-[1px] bg-primary mx-4"></span>
          <img src="/share.png" alt="share" className="m-0" />
        </div>
        <div
          className={`bg-secondary3 p-2 absolute -translate-x-1/2 -bottom-full left-1/2 transition-opacity rounded ${
            displayState ? "opacity-100" : "opacity-0"
          }`}
        >
          Copied To Clipboard
        </div>
      </button>
    </div>
  );
};

export default PollShare;
