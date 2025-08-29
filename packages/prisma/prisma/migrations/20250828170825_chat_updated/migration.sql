/*
  Warnings:

  - The primary key for the `chats` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `delivered` on the `chats` table. All the data in the column will be lost.
  - You are about to drop the column `receivernumber` on the `chats` table. All the data in the column will be lost.
  - You are about to drop the column `sendernumber` on the `chats` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `chats` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fromPhone` to the `chats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toPhone` to the `chats` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "chats" DROP CONSTRAINT "chats_receivernumber_fkey";

-- DropForeignKey
ALTER TABLE "chats" DROP CONSTRAINT "chats_sendernumber_fkey";

-- DropIndex
DROP INDEX "chats_sendernumber_receivernumber_timestamp_idx";

-- AlterTable
ALTER TABLE "chats" DROP CONSTRAINT "chats_pkey",
DROP COLUMN "delivered",
DROP COLUMN "receivernumber",
DROP COLUMN "sendernumber",
ADD COLUMN     "fromPhone" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "toPhone" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "chats_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "chats_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "chats_id_key" ON "chats"("id");

-- CreateIndex
CREATE INDEX "chats_fromPhone_toPhone_timestamp_idx" ON "chats"("fromPhone", "toPhone", "timestamp");

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_fromPhone_fkey" FOREIGN KEY ("fromPhone") REFERENCES "User"("number") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_toPhone_fkey" FOREIGN KEY ("toPhone") REFERENCES "User"("number") ON DELETE RESTRICT ON UPDATE CASCADE;
