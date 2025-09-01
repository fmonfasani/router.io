DO $$ BEGIN
    ALTER TYPE "logPostType" ADD VALUE 'webhook';
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TYPE "logPostType" ADD VALUE 'email';
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;
