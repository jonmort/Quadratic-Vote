/*
  Warnings:

  - A unique constraint covering the columns `[authorId,pollId]` on the table `Voter` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Voter_authorId_pollId_key" ON "Voter"("authorId", "pollId");
