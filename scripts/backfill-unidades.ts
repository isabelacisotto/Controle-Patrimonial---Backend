import { prisma } from "../prisma/prisma";

async function backfillUnidades(): Promise<void> {
  const itens = await prisma.item.findMany({
    select: {
      id: true,
      quantidade: true,
      _count: { select: { unidades: true } },
    },
  });

  let totalCriado = 0;
  for (const item of itens) {
    let pendentes = Math.max(0, item.quantidade - item._count.unidades);
    while (pendentes > 0) {
      const lote = Math.min(pendentes, 400);
      await prisma.unidadeItem.createMany({
        data: Array.from({ length: lote }, () => ({ itemId: item.id })),
      });
      totalCriado += lote;
      pendentes -= lote;
    }
  }

  console.log(`${totalCriado} unidade(s) criada(s) sem localização inicial.`);
}

backfillUnidades()
  .catch((error: unknown) => {
    console.error("Falha ao completar unidades de patrimônio:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
