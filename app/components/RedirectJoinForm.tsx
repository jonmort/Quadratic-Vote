import { Form } from "@remix-run/react";
import React from "react";

const RedirectJoinForm = () => {
  return (
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
  );
};

export default RedirectJoinForm;
