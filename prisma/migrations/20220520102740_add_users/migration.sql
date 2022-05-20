/*
  Warnings:

  - Added the required column `authorId` to the `Poll` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorId` to the `Voter` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Option" DROP CONSTRAINT "Option_pollId_fkey";

-- DropForeignKey
ALTER TABLE "Voter" DROP CONSTRAINT "Voter_pollId_fkey";

-- AlterTable
ALTER TABLE "Poll" ADD COLUMN     "authorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Voter" ADD COLUMN     "authorId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "oauthId" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_oauthId_key" ON "User"("oauthId");

-- AddForeignKey
ALTER TABLE "Poll" ADD CONSTRAINT "Poll_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("oauthId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "Poll"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voter" ADD CONSTRAINT "Voter_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "Poll"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voter" ADD CONSTRAINT "Voter_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("oauthId") ON DELETE RESTRICT ON UPDATE CASCADE;
