/*
  Warnings:

  - You are about to drop the column `name` on the `Ambiente` table. All the data in the column will be lost.
  - Added the required column `nome` to the `Ambiente` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ambiente" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "blocoId" TEXT NOT NULL,
    "responsavel" TEXT NOT NULL,
    CONSTRAINT "Ambiente_blocoId_fkey" FOREIGN KEY ("blocoId") REFERENCES "Bloco" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Ambiente" ("blocoId", "id", "responsavel") SELECT "blocoId", "id", "responsavel" FROM "Ambiente";
DROP TABLE "Ambiente";
ALTER TABLE "new_Ambiente" RENAME TO "Ambiente";
CREATE UNIQUE INDEX "Ambiente_blocoId_nome_key" ON "Ambiente"("blocoId", "nome");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
