import type { Prisma } from "../../../../prisma/generated/prisma/client";

export type Movimentacao = Prisma.MovimentacaoGetPayload<{
  include: {
    unidadeItem: {
      include: {
        item: true;
        ambiente: true;
      };
    };
  };
}>;

export interface CriarMovimentacaoDTO {
  unidadeItemId: string;
  origem: string;
  destino: string;
  resp: string;
}
