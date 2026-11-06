import { prisma } from "../../../../prisma/prisma";
import type { CriarMovimentacaoDTO, Movimentacao } from "../dtos/movimentacao.dto";

const movimentacaoInclude = {
  unidadeItem: {
    include: {
      item: true,
      ambiente: true
    }
  }
} satisfies NonNullable<Parameters<typeof prisma.movimentacao.findMany>[0]>["include"];

export class MovimentacaoRepository {
  public async listarMovimentacoes(): Promise<Movimentacao[]> {
    return prisma.movimentacao.findMany({
      include: movimentacaoInclude,
      orderBy: { dataMovimentacao: "desc" }
    });
  }

  public async obterMovimentacaoPorId(id: string): Promise<Movimentacao | null> {
    return prisma.movimentacao.findUnique({
      where: { id },
      include: movimentacaoInclude
    });
  }

  public async unidadeItemExiste(id: string): Promise<boolean> {
    const unidadeItem = await prisma.unidadeItem.findUnique({
      where: { id },
      select: { id: true }
    });
    return unidadeItem !== null;
  }

  public async criarMovimentacao(data: CriarMovimentacaoDTO): Promise<Movimentacao> {
    return prisma.movimentacao.create({
      data,
      include: movimentacaoInclude
    });
  }
}
