/*
  Warnings:

  - Added the required column `time` to the `chats` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `chats` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "chats" ADD COLUMN     "time" TEXT NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL;
