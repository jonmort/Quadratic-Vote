import { Form, Link } from "@remix-run/react";
import React from "react";


const Home = () => {
  return (
    <div>
      <h1>Welcome</h1>
      <Link to='/create' className="my-4 border-black border-2 p-2 inline-block">Create a new poll</Link>
      <Form action="/join" method='get'>
        <label htmlFor="pollId">Join a poll:</label>
        <input className="border-2 border-black p-2 ml-2" type="text" name="pollId" placeholder="Poll ID" />
      </Form>
    </div>
  );
};

export default Home;
