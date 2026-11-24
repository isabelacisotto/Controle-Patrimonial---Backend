import { prisma } from "../../../../prisma/prisma";
import type {
  AtualizarEstadoUnidadeDTO,
  AtualizarPatrimonioDTO,
  CriarPatrimonioDTO,
  PatrimonioComUnidades
} from "../dtos/patrimonio.dto";

export type ResultadoExclusaoPatrimonio =
  | "nao_encontrado"
  | "possui_movimentacoes"
  | "excluido";

export class PatrimonioRepository {
  public async obterPatrimonioPorId(id: string): Promise<PatrimonioComUnidades | null> {
    return prisma.item.findUnique({
      where: { id },
      include: {
        unidades: {
          include: { ambiente: true },
          orderBy: { createdAt: "asc" },
        }
      }
    });
  }

  public async listarPatrimonios(): Promise<PatrimonioComUnidades[]> {
    return prisma.item.findMany({
      include: {
        unidades: {
          include: { ambiente: true },
          orderBy: { createdAt: "asc" },
        }
      }
    });
  }

  public async criarPatrimonio(data: CriarPatrimonioDTO): Promise<PatrimonioComUnidades> {
    const { ambienteId, ...dadosItem } = data;

    return prisma.$transaction(async (transaction) => {
      const item = await transaction.item.create({ data: dadosItem });

      let pendentes = item.quantidade;
      while (pendentes > 0) {
        const lote = Math.min(pendentes, 400);
        await transaction.unidadeItem.createMany({
          data: Array.from({ length: lote }, () => ({
            itemId: item.id,
            ambienteId: ambienteId ?? null,
          })),
        });
        pendentes -= lote;
      }

      return transaction.item.findUniqueOrThrow({
        where: { id: item.id },
        include: {
          unidades: {
            include: { ambiente: true },
            orderBy: { createdAt: "asc" },
          },
        },
      });
    });
  }

  public async ambienteExiste(id: string): Promise<boolean> {
    const ambiente = await prisma.ambiente.findUnique({
      where: { id },
      select: { id: true },
    });
    return ambiente !== null;
  }

  public async atualizarPatrimonio(id: string, data: AtualizarPatrimonioDTO): Promise<void> {
    const { ambienteId, ...dadosPatrimonio } = data;
    await prisma.$transaction(async (transaction) => {
      const item = await transaction.item.findUnique({
        where: { id },
        select: { _count: { select: { unidades: true } } },
      });
      if (!item) {
        throw new Error("Patrimônio não encontrado.");
      }

      if (data.quantidade !== undefined) {
        if (data.quantidade < item._count.unidades) {
          throw new Error("A quantidade não pode ser menor que o número de unidades já cadastradas.");
        }

        let pendentes = data.quantidade - item._count.unidades;
        while (pendentes > 0) {
          const lote = Math.min(pendentes, 400);
          await transaction.unidadeItem.createMany({
            data: Array.from({ length: lote }, () => ({
              itemId: id,
              ambienteId: ambienteId ?? null,
            })),
          });
          pendentes -= lote;
        }
      }

      await transaction.item.update({ where: { id }, data: dadosPatrimonio });
    });
  }

  public async excluirPatrimonio(id: string): Promise<ResultadoExclusaoPatrimonio> {
    return prisma.$transaction(async (transaction) => {
      const item = await transaction.item.findUnique({
        where: { id },
        select: { id: true },
      });
      if (!item) {
        return "nao_encontrado";
      }

      const movimentacoes = await transaction.movimentacao.count({
        where: { itemId: id },
      });
      if (movimentacoes > 0) {
        return "possui_movimentacoes";
      }

      await transaction.unidadeItem.deleteMany({ where: { itemId: id } });
      await transaction.item.delete({ where: { id } });
      return "excluido";
    });
  }

  public async unidadeItemExiste(id: string): Promise<boolean> {
    const unidade = await prisma.unidadeItem.findUnique({
      where: { id },
      select: { id: true },
    });
    return unidade !== null;
  }

  public async atualizarEstadoUnidade(
    id: string,
    data: AtualizarEstadoUnidadeDTO,
  ): Promise<void> {
    await prisma.unidadeItem.update({
      where: { id },
      data: { estado: data.estado },
    });
  }
}
