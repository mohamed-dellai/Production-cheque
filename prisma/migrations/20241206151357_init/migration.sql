-- CreateTable
CREATE TABLE "Cheque" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR(10) NOT NULL,
    "bank" VARCHAR(255) NOT NULL,
    "number" VARCHAR(50) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "beneficiary" VARCHAR(255) NOT NULL,
    "status" VARCHAR(10) NOT NULL,
    "notes" TEXT,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "imageUrl" TEXT NOT NULL,

    CONSTRAINT "Cheque_pkey" PRIMARY KEY ("id")
);
