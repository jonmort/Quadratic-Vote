import type { ActionFunction } from "@remix-run/node";
import { db } from "~/utils/prisma.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const optionId = Number(formData.get("optionId"));
  const voterId = formData.get("voterId");

  if (
    !optionId ||
    !voterId ||
    typeof voterId !== "string" ||
    typeof optionId !== "number" ||
    Number.isNaN(optionId)
  ) {
    return new Response("Voter and Option is required", { status: 400 });
  }

  const voter = await db.voter.findFirst({
    where: { id: voterId },
    select: { credits: true },
  });

  if (!voter) return new Response("Voter not found.", { status: 404 });

  const existingVotes = await db.vote.findMany({
    where: { voterId, optionId },
    select: { id: true },
  });

  if (existingVotes.length === 0) return true;

  const creditsToRedeem = existingVotes.length ** 2;

  await db.$transaction([
    db.vote.delete({
      where: { id: existingVotes[existingVotes.length - 1].id },
      select: null
    }),
    db.voter.update({
      where: { id: voterId },
      data: { credits: voter.credits + creditsToRedeem },
      select: null
    }),
  ]);

  return null;
};
