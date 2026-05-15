/*
  Warnings:

  - A unique constraint covering the columns `[tagName]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `tagName` on the `Tag` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TagName" AS ENUM ('JAZZ', 'POP', 'ROCK', 'HIPHOP', 'CLASSIC', 'RNB', 'ELECTRONIC', 'INDIE', 'BALLAD');

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "tagName",
ADD COLUMN     "tagName" "TagName" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Tag_tagName_key" ON "Tag"("tagName");
