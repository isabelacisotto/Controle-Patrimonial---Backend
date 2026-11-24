ALTER TABLE "Movimentacao" ADD COLUMN "expiresAt" DATETIME;

CREATE INDEX "Movimentacao_expiresAt_idx" ON "Movimentacao"("expiresAt");
