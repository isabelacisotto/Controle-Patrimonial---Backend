PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;

CREATE TABLE "new_Movimentacao" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "itemId" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL DEFAULT 1,
    "origem" TEXT NOT NULL,
    "destino" TEXT NOT NULL,
    "resp" TEXT NOT NULL,
    "dataMovimentacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Movimentacao_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO "new_Movimentacao" (
    "id",
    "itemId",
    "quantidade",
    "origem",
    "destino",
    "resp",
    "dataMovimentacao"
)
SELECT
    movimentacao."id",
    unidade."itemId",
    1,
    movimentacao."origem",
    movimentacao."destino",
    movimentacao."resp",
    movimentacao."dataMovimentacao"
FROM "Movimentacao" AS movimentacao
JOIN "UnidadeItem" AS unidade ON unidade."id" = movimentacao."unidadeItemId";

DROP TABLE "Movimentacao";
ALTER TABLE "new_Movimentacao" RENAME TO "Movimentacao";
CREATE INDEX "Movimentacao_itemId_idx" ON "Movimentacao"("itemId");

COMMIT;
PRAGMA foreign_keys=ON;
