import { Link, useLoaderData } from "@remix-run/react";
import React from "react";
import type { RootLoaderData } from "~/root";

const Navbar = () => {
  const data = useLoaderData<RootLoaderData>();  

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          Quadratic Vote
        </Link>
      </div>
      {!data.isLoggedIn ? (
        <>
          <div
            id="g_id_onload"
            data-client_id={data.clientId}
            data-context="signin"
            data-ux_mode="popup"
            data-login_uri={data.redirectUri}
            data-auto_prompt="true"
          ></div>
          <div
            className="g_id_signin"
            data-type="standard"
            data-shape="pill"
            data-theme="filled_blue"
            data-text="signin_with"
            data-size="medium"
            data-logo_alignment="left"
          ></div>
        </>
      ) : <Link to='/auth/logout' className="btn btn-sm">Logout</Link>}
    </div>
  );
};

export default Navbar;
