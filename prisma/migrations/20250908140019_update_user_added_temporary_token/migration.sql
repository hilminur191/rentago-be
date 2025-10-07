/*
  Warnings:

  - You are about to drop the column `picture` on the `Property` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "rentago"."TemporaryTokenType" AS ENUM ('RESET_PASSWORD', 'VERIFY_EMAIL', 'FORGOT_PASSWORD');

-- AlterTable
ALTER TABLE "rentago"."Property" DROP COLUMN "picture";

-- AlterTable
ALTER TABLE "rentago"."User" ADD COLUMN     "is_external_login" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "rentago"."TemporaryToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiredAt" TIMESTAMP(3) NOT NULL,
    "type" "rentago"."TemporaryTokenType" NOT NULL,

    CONSTRAINT "TemporaryToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rentago"."PropertyPicture" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "property_id" TEXT NOT NULL,

    CONSTRAINT "PropertyPicture_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TemporaryToken_token_key" ON "rentago"."TemporaryToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyPicture_url_key" ON "rentago"."PropertyPicture"("url");

-- AddForeignKey
ALTER TABLE "rentago"."TemporaryToken" ADD CONSTRAINT "TemporaryToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "rentago"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rentago"."PropertyPicture" ADD CONSTRAINT "PropertyPicture_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "rentago"."Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
