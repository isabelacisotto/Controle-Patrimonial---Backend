-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tombamento" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "valor" DECIMAL NOT NULL,
    "categoria" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "UnidadeItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "estado" TEXT NOT NULL DEFAULT 'ATIVO',
    "itemId" TEXT NOT NULL,
    "ambienteId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UnidadeItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UnidadeItem_ambienteId_fkey" FOREIGN KEY ("ambienteId") REFERENCES "Ambiente" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Ambiente" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "blocoId" TEXT NOT NULL,
    "responsavel" TEXT NOT NULL,
    CONSTRAINT "Ambiente_blocoId_fkey" FOREIGN KEY ("blocoId") REFERENCES "Bloco" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Movimentacao" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "unidadeItemId" TEXT NOT NULL,
    "origem" TEXT NOT NULL,
    "destino" TEXT NOT NULL,
    "resp" TEXT NOT NULL,
    "dataMovimentacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Movimentacao_unidadeItemId_fkey" FOREIGN KEY ("unidadeItemId") REFERENCES "UnidadeItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Bloco" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "numero" INTEGER
);

-- CreateIndex
CREATE UNIQUE INDEX "Ambiente_blocoId_name_key" ON "Ambiente"("blocoId", "name");
