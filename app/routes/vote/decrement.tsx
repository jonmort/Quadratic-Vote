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
    select: { votes: true, credits: true },
  });

  if (!voter) return new Response("Voter not found.", { status: 404 });

  const existingVotes = voter.votes.filter(
    (vote) => vote.optionId === optionId
  );

  if (existingVotes.length === 0) return true;

  const creditsToRedeem = existingVotes.length ** 2;

  await db.$transaction([
    db.vote.delete({
      where: { id: existingVotes[existingVotes.length - 1].id },
    }),
    db.voter.update({
      where: { id: voterId },
      data: { credits: voter.credits + creditsToRedeem },
    }),
  ]);

  return true;
};
