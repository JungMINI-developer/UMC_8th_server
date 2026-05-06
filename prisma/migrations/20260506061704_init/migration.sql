-- CreateTable
CREATE TABLE "User" (
    "userId" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "provider" TEXT,
    "providerId" TEXT,
    "name" TEXT NOT NULL,
    "profile" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Lp" (
    "lpId" SERIAL NOT NULL,
    "authorId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "lpJacket" TEXT,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Lp_pkey" PRIMARY KEY ("lpId")
);

-- CreateTable
CREATE TABLE "Star" (
    "starId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "lpId" INTEGER NOT NULL,
    "rate" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Star_pkey" PRIMARY KEY ("starId")
);

-- CreateTable
CREATE TABLE "Like" (
    "likeId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "lpId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("likeId")
);

-- CreateTable
CREATE TABLE "Comment" (
    "commentId" SERIAL NOT NULL,
    "authorId" INTEGER NOT NULL,
    "lpId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("commentId")
);

-- CreateTable
CREATE TABLE "Tag" (
    "tagId" SERIAL NOT NULL,
    "tagName" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("tagId")
);

-- CreateTable
CREATE TABLE "LpTagMapping" (
    "lpTagId" SERIAL NOT NULL,
    "lpId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "LpTagMapping_pkey" PRIMARY KEY ("lpTagId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_provider_providerId_key" ON "User"("provider", "providerId");

-- CreateIndex
CREATE UNIQUE INDEX "Star_userId_lpId_key" ON "Star"("userId", "lpId");

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_lpId_key" ON "Like"("userId", "lpId");

-- CreateIndex
CREATE UNIQUE INDEX "LpTagMapping_lpId_tagId_key" ON "LpTagMapping"("lpId", "tagId");

-- AddForeignKey
ALTER TABLE "Lp" ADD CONSTRAINT "Lp_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Star" ADD CONSTRAINT "Star_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Star" ADD CONSTRAINT "Star_lpId_fkey" FOREIGN KEY ("lpId") REFERENCES "Lp"("lpId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_lpId_fkey" FOREIGN KEY ("lpId") REFERENCES "Lp"("lpId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_lpId_fkey" FOREIGN KEY ("lpId") REFERENCES "Lp"("lpId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LpTagMapping" ADD CONSTRAINT "LpTagMapping_lpId_fkey" FOREIGN KEY ("lpId") REFERENCES "Lp"("lpId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LpTagMapping" ADD CONSTRAINT "LpTagMapping_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("tagId") ON DELETE RESTRICT ON UPDATE CASCADE;
