-- CreateIndex
CREATE INDEX "Email_userId_status_idx" ON "Email"("userId", "status");

-- CreateIndex
CREATE INDEX "Email_userId_scheduledAt_idx" ON "Email"("userId", "scheduledAt");

-- CreateIndex
CREATE INDEX "Email_userId_sentAt_idx" ON "Email"("userId", "sentAt");

-- CreateIndex
CREATE INDEX "Email_userId_createdAt_idx" ON "Email"("userId", "createdAt");
