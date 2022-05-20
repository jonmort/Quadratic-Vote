import { Link, useLoaderData, useLocation } from "@remix-run/react";
import React from "react";
import type { RootLoaderData } from "~/root";

const Navbar = () => {
  const data = useLoaderData<RootLoaderData>();
  const location = useLocation();

  return (
    <div
      className={`py-2 relative z-10 ${
        location.pathname !== "/" ? "bg-primary" : ""
      }`}
    >
      <div className="container mx-auto flex items-center">
        <div className="flex-1">
          <Link to="/" className="flex py-2 text-3xl space-x-2">
            <img src="/qv_logo.png" alt="Quadratic Vote" className="h-10" />
            <span className="relative text-secondary3">Quadratic Vote</span>
          </Link>
        </div>
        <div className="flex items-center space-x-5">
          <div
            className="g_id_signin"
            data-type="standard"
            data-shape="pill"
            data-theme="filled_blue"
            data-text="signin_with"
            data-size="medium"
            data-logo_alignment="left"
            hidden={data.isLoggedIn}
          ></div>
          <div
            hidden={data.isLoggedIn}
            id="g_id_onload"
            data-client_id={data.clientId}
            data-context="signin"
            data-ux_mode="popup"
            data-login_uri={data.redirectUri}
            data-auto_prompt="false"
          ></div>
          {data.isLoggedIn && (
            <Link to="/auth/logout" className="btn bg-secondary3">
              Logout
            </Link>
          )}
          <Link to="/create" className="btn bg-accent3">
            Create A New Poll
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
