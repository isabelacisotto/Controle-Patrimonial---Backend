ALTER TABLE "Movimentacao" ADD COLUMN "origemAmbienteId" TEXT;
ALTER TABLE "Movimentacao" ADD COLUMN "destinoAmbienteId" TEXT;
ALTER TABLE "Movimentacao" ADD COLUMN "expirationProcessedAt" DATETIME;

UPDATE "Movimentacao"
SET "origemAmbienteId" = (
    SELECT "id" FROM "Ambiente"
    WHERE "nome" = "Movimentacao"."origem"
    LIMIT 1
)
WHERE "origem" <> 'Sem localização'
  AND (
      SELECT COUNT(*) FROM "Ambiente"
      WHERE "nome" = "Movimentacao"."origem"
  ) = 1;

UPDATE "Movimentacao"
SET "destinoAmbienteId" = (
    SELECT "id" FROM "Ambiente"
    WHERE "nome" = "Movimentacao"."destino"
    LIMIT 1
)
WHERE (
    SELECT COUNT(*) FROM "Ambiente"
    WHERE "nome" = "Movimentacao"."destino"
) = 1;

DROP INDEX "Movimentacao_expiresAt_idx";
CREATE INDEX "Movimentacao_expiresAt_expirationProcessedAt_idx"
    ON "Movimentacao"("expiresAt", "expirationProcessedAt");
