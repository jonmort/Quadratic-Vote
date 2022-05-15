import { Link } from "@remix-run/react";
import React from "react";

const Navbar = () => {
  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          Quadratic Vote
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
