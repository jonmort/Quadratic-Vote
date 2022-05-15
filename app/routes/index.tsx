import { Form, Link } from "@remix-run/react";
import React from "react";

const Home = () => {
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
                  <li>
                    <Link to="/">Something</Link>
                  </li>
                  <li>
                    <Link to="/">Something</Link>
                  </li>
                  <li>
                    <Link to="/">Something</Link>
                  </li>
                  <li>
                    <Link to="/">Something</Link>
                  </li>
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
        {/* <div className="mb-8 mt-16">
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
        </Form> */}
      </div>
    </div>
  );
};

export default Home;
