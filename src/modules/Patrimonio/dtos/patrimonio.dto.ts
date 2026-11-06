import type { Prisma } from "../../../../prisma/generated/prisma/client";
import type { Categoria, EstadoItem } from "../../../../prisma/generated/prisma/enums";
import type { Ambiente } from "../../Ambientes/dtos/ambiente.dto";

export interface UnidadeItem {
  id: string;
  estado: EstadoItem;
  itemId: string;
  item: Patrimonio;
  ambienteId: string | null;
  ambiente: Ambiente | null;
  createdAt: Date;
}

export interface Patrimonio {
    id: string;
    tombamento: number;
    nome: string;
    descricao: string | null;
    valor: Prisma.Decimal;
    categoria: Categoria;
    marca: string;
    quantidade: number;
    createdAt: Date;
}

export type Item = Patrimonio;

export type PatrimonioComUnidades = Prisma.ItemGetPayload<{
  include: {
    unidades: {
      include: {
        ambiente: true;
      };
    };
  };
}>;

export interface CriarPatrimonioDTO {
  tombamento: number;
  nome: string;
  descricao?: string | null;
  valor: number;
  categoria: Categoria;
  marca: string;
  quantidade: number;
}

export type AtualizarPatrimonioDTO = Partial<CriarPatrimonioDTO>;
