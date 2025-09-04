ALTER TABLE "transactions" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."transactionTypeRoles";--> statement-breakpoint
CREATE TYPE "public"."transactionTypeRoles" AS ENUM('income', 'expense');--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "type" SET DATA TYPE "public"."transactionTypeRoles" USING "type"::"public"."transactionTypeRoles";