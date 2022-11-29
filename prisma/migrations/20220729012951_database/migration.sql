-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_webhookId_fkey";

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_webhookId_fkey" FOREIGN KEY ("webhookId") REFERENCES "Webhook"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "Webhook.key_index" RENAME TO "Webhook_key_idx";

-- RenameIndex
ALTER INDEX "Webhook.key_unique" RENAME TO "Webhook_key_key";

-- RenameIndex
ALTER INDEX "Webhook.url_index" RENAME TO "Webhook_url_idx";

-- RenameIndex
ALTER INDEX "Webhook.url_unique" RENAME TO "Webhook_url_key";
