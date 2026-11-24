import type { Prisma } from "../../../../prisma/generated/prisma/client";

export type Movimentacao = Prisma.MovimentacaoGetPayload<{
  include: {
    item: true;
  };
}>;

export interface CriarMovimentacaoDTO {
  itemId: string;
  origemAmbienteId: string | null;
  destinoAmbienteId: string;
  quantidade: number;
  resp: string;
  expiresAt: string;
}
