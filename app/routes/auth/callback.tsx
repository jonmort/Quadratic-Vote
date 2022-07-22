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
  const url = new URL(request.url);
  const pollId = url.searchParams.get("pollId");
  return createUserSession(user.oauthId, pollId ? `/poll/${pollId}` : "/");
};
