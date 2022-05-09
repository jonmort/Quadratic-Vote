import { Form, Link } from "@remix-run/react";
import React from "react";

const Home = () => {
  return (
    <div className="container mx-auto text-center">
      <div className="mt-[20vh]">
        <h1 className="text-4xl">Welcome to Quadratic Voting</h1>
        <div className="mb-8 mt-16">
          <Link className="btn" to="/create">
            Create a new poll
          </Link>
        </div>
        <p className="text-3xl my-6">OR</p>
        <Form action="/join" method="get">
          <div className="flex flex-col items-center">
            <input className="input mb-4" type="text" name="pollId" placeholder="Poll ID" />
            <button type="submit" className="btn">
              Join A poll
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Home;
