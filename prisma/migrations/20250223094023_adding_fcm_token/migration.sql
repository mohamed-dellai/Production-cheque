-- AlterTable
ALTER TABLE "account" ADD COLUMN     "fcmToken" TEXT[] DEFAULT ARRAY[]::TEXT[];
