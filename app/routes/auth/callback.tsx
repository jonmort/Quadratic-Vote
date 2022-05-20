import type { ActionFunction} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { createUserSession, getOrCreateUser } from "~/utils/session.server";

export const action: ActionFunction = async ({ request }) => {
  // validate token
  const formData = await request.formData();
  const token = formData.get("credential");
  if (typeof token !== "string") {
    return redirect("/");
  }
  // Get or create user
  const user = await getOrCreateUser(token);
  // create session
  return createUserSession(user.oauthId, "/");
};
