-- AlterTable
ALTER TABLE "Cheque" ADD COLUMN     "accountId" TEXT NOT NULL DEFAULT '1';

-- AddForeignKey
ALTER TABLE "Cheque" ADD CONSTRAINT "Cheque_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
