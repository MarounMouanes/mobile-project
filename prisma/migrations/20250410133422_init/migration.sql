-- CreateTable
CREATE TABLE "p" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "p_pkey" PRIMARY KEY ("id")
);
