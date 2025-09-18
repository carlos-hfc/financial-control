ALTER TABLE "accounts" DROP CONSTRAINT "accounts_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "categories" DROP CONSTRAINT "categories_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_accountId_accounts_id_fk";
--> statement-breakpoint
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_accountId_accounts_id_fk" FOREIGN KEY ("accountId") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;