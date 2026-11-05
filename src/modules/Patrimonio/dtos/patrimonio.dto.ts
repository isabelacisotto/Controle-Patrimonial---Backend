import type { Prisma } from "../../../../prisma/generated/prisma/client";
import type { Categoria, EstadoItem } from "../../../../prisma/generated/prisma/enums";
import type { Ambiente } from "../../Ambientes/dtos/ambiente.dto";

export interface UnidadeItem {
  id: string;
  estado: EstadoItem;
  itemId: string;
  item: Item;
  ambienteId: string | null;
  ambiente: Ambiente | null;
  createdAt: Date;
}

export interface Item {
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
