-- DropForeignKey
ALTER TABLE "Poll" DROP CONSTRAINT "Poll_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Voter" DROP CONSTRAINT "Voter_authorId_fkey";

-- AlterTable
ALTER TABLE "Poll" ALTER COLUMN "authorId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Voter" ALTER COLUMN "authorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Poll" ADD CONSTRAINT "Poll_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("oauthId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voter" ADD CONSTRAINT "Voter_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("oauthId") ON DELETE SET NULL ON UPDATE CASCADE;
