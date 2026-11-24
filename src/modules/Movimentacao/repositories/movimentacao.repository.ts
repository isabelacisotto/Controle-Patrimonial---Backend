import { prisma } from "../../../../prisma/prisma";
import type { CriarMovimentacaoDTO, Movimentacao } from "../dtos/movimentacao.dto";
import { ErroMovimentacao } from "../errors/movimentacao.error";

const movimentacaoInclude = {
  item: true,
} satisfies NonNullable<Parameters<typeof prisma.movimentacao.findMany>[0]>["include"];

export class MovimentacaoRepository {
  public async processarExpiracoes(now = new Date()): Promise<{
    processadas: number;
    pendentes: string[];
  }> {
    const expiradas = await prisma.movimentacao.findMany({
      where: {
        expiresAt: { lte: now },
        expirationProcessedAt: null,
      },
      orderBy: [{ expiresAt: "asc" }, { dataMovimentacao: "asc" }],
      select: { id: true },
    });
    let processadas = 0;
    const pendentes: string[] = [];

    for (const { id } of expiradas) {
      const resultado = await prisma.$transaction(async (transaction) => {
        const movimentacao = await transaction.movimentacao.findUnique({
          where: { id },
          select: {
            id: true,
            itemId: true,
            quantidade: true,
            origemAmbienteId: true,
            destinoAmbienteId: true,
            expiresAt: true,
            expirationProcessedAt: true,
          },
        });
        if (
          !movimentacao ||
          movimentacao.expirationProcessedAt ||
          !movimentacao.expiresAt ||
          movimentacao.expiresAt > now
        ) {
          return "ignorada";
        }
        if (!movimentacao.destinoAmbienteId) {
          return "ambiente de destino não identificado";
        }

        const destino = await transaction.ambiente.findUnique({
          where: { id: movimentacao.destinoAmbienteId },
          select: { id: true },
        });
        if (!destino) {
          return "ambiente de destino não encontrado";
        }
        if (movimentacao.origemAmbienteId) {
          const origem = await transaction.ambiente.findUnique({
            where: { id: movimentacao.origemAmbienteId },
            select: { id: true },
          });
          if (!origem) {
            return "ambiente de origem não encontrado";
          }
        }

        const unidades = await transaction.unidadeItem.findMany({
          where: {
            itemId: movimentacao.itemId,
            ambienteId: destino.id,
          },
          select: { id: true },
          orderBy: { createdAt: "asc" },
          take: movimentacao.quantidade,
        });
        if (unidades.length < movimentacao.quantidade) {
          return `saldo insuficiente no destino (${unidades.length}/${movimentacao.quantidade})`;
        }

        const claim = await transaction.movimentacao.updateMany({
          where: { id, expirationProcessedAt: null },
          data: { expirationProcessedAt: now },
        });
        if (claim.count !== 1) {
          return "ignorada";
        }

        await transaction.unidadeItem.updateMany({
          where: { id: { in: unidades.map((unidade) => unidade.id) } },
          data: { ambienteId: movimentacao.origemAmbienteId },
        });

        return "processada";
      });

      if (resultado === "processada") {
        processadas += 1;
      } else if (resultado !== "ignorada") {
        pendentes.push(`${id}: ${resultado}`);
      }
    }

    return { processadas, pendentes };
  }

  public async listarMovimentacoes(): Promise<Movimentacao[]> {
    return prisma.movimentacao.findMany({
      where: {
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
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

  public async criarMovimentacao(data: CriarMovimentacaoDTO): Promise<Movimentacao> {
    return prisma.$transaction(async (transaction) => {
      const item = await transaction.item.findUnique({
        where: { id: data.itemId },
        select: { id: true },
      });
      if (!item) {
        throw new ErroMovimentacao(404, "Patrimônio não encontrado.");
      }

      const destino = await transaction.ambiente.findUnique({
        where: { id: data.destinoAmbienteId },
        select: { id: true, nome: true },
      });
      if (!destino) {
        throw new ErroMovimentacao(404, "Ambiente de destino não encontrado.");
      }

      let nomeOrigem = "Sem localização";
      if (data.origemAmbienteId !== null) {
        const origem = await transaction.ambiente.findUnique({
          where: { id: data.origemAmbienteId },
          select: { id: true, nome: true },
        });
        if (!origem) {
          throw new ErroMovimentacao(404, "Ambiente de origem não encontrado.");
        }
        if (origem.id === destino.id) {
          throw new ErroMovimentacao(409, "O ambiente de origem e o destino devem ser diferentes.");
        }
        nomeOrigem = origem.nome;
      }

      const unidades = await transaction.unidadeItem.findMany({
        where: {
          itemId: data.itemId,
          ambienteId: data.origemAmbienteId,
        },
        select: { id: true },
        orderBy: { createdAt: "asc" },
        take: data.quantidade,
      });
      if (unidades.length < data.quantidade) {
        throw new ErroMovimentacao(
          409,
          `Quantidade indisponível no ambiente de origem. Disponíveis: ${unidades.length}.`,
        );
      }

      await transaction.unidadeItem.updateMany({
        where: { id: { in: unidades.map((unidade) => unidade.id) } },
        data: { ambienteId: destino.id },
      });

      return transaction.movimentacao.create({
        data: {
          itemId: item.id,
          origem: nomeOrigem,
          destino: destino.nome,
          quantidade: data.quantidade,
          resp: data.resp,
          expiresAt: new Date(data.expiresAt),
          origemAmbienteId: data.origemAmbienteId,
          destinoAmbienteId: data.destinoAmbienteId,
        },
        include: movimentacaoInclude,
      });
    });
  }
}
