-- CreateEnum
CREATE TYPE "ChatType" AS ENUM ('text', 'image');

-- CreateTable
CREATE TABLE "chats" (
    "id" SERIAL NOT NULL,
    "sendernumber" TEXT NOT NULL,
    "receivernumber" TEXT NOT NULL,
    "message" TEXT,
    "imageUrl" TEXT,
    "imageCaption" TEXT,
    "type" "ChatType" NOT NULL DEFAULT 'text',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delivered" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "chats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "chats_sendernumber_receivernumber_timestamp_idx" ON "chats"("sendernumber", "receivernumber", "timestamp");

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_sendernumber_fkey" FOREIGN KEY ("sendernumber") REFERENCES "User"("number") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_receivernumber_fkey" FOREIGN KEY ("receivernumber") REFERENCES "User"("number") ON DELETE RESTRICT ON UPDATE CASCADE;
