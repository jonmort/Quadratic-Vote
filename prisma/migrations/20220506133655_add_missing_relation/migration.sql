/*
  Warnings:

  - Added the required column `pollId` to the `Voter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Voter" ADD COLUMN     "pollId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Voter" ADD CONSTRAINT "Voter_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "Poll"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
