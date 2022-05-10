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

  if (voter.credits < 1)
    return new Response("Not enough credits", { status: 400 });

  const existingVotesLength = await db.vote.count({
    where: { voterId, optionId }
  });
  const requiredCredits = existingVotesLength > 0 ? (existingVotesLength + 1) ** 2 : 1;

  if (voter.credits < requiredCredits)
    return new Response("Not enough credits", { status: 400 });

  await db.$transaction([
    db.vote.create({ data: { voterId, optionId }, select: null }),
    db.voter.update({
      where: { id: voterId },
      data: { credits: voter.credits - requiredCredits },
      select: null
    }),
  ]);

  return null;
};
