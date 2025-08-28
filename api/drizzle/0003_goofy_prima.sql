CREATE TYPE "public"."accountTypeRoles" AS ENUM('corrente', 'poupanca', 'credito');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"name" text NOT NULL,
	"type" "accountTypeRoles" DEFAULT 'corrente' NOT NULL,
	"initialBalance" numeric(10, 2) DEFAULT '0' NOT NULL,
	"currentBalance" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;