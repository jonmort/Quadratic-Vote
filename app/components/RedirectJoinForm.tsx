import { Form } from "@remix-run/react";
import React from "react";

const RedirectJoinForm = () => {
  return (
    <Form className="flex pb-4" action="/join" method="get">
      <div className="flex flex-col w-full">
        <input
          className="mb-4 input"
          type="text"
          name="pollId"
          placeholder="Poll ID"
        />
        <button type="submit" className="uppercase btn bg-accent3">
          Join A poll
        </button>
      </div>
    </Form>
  );
};

export default RedirectJoinForm;
