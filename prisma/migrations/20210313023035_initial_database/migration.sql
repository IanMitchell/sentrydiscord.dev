-- CreateTable
CREATE TABLE "Webhook" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "webhookId" INTEGER NOT NULL,
    "platform" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Webhook.key_unique" ON "Webhook"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Webhook.url_unique" ON "Webhook"("url");

-- CreateIndex
CREATE INDEX "Webhook.key_index" ON "Webhook"("key");

-- CreateIndex
CREATE INDEX "Webhook.url_index" ON "Webhook"("url");

-- AddForeignKey
ALTER TABLE "Event" ADD FOREIGN KEY ("webhookId") REFERENCES "Webhook"("id") ON DELETE CASCADE ON UPDATE CASCADE;
