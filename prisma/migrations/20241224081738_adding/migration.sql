/*
  Warnings:

  - A unique constraint covering the columns `[number]` on the table `Cheque` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Cheque_number_key" ON "Cheque"("number");
