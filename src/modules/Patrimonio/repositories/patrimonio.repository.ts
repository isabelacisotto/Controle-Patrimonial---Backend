import { prisma } from "../../../../prisma/prisma";
import type {
  AtualizarPatrimonioDTO,
  CriarPatrimonioDTO,
  Patrimonio,
  PatrimonioComUnidades
} from "../dtos/patrimonio.dto";

export class PatrimonioRepository {
  public async obterPatrimonioPorId(id: string): Promise<PatrimonioComUnidades | null> {
    return prisma.item.findUnique({
      where: { id },
      include: {
        unidades: {
          include: { ambiente: true }
        }
      }
    });
  }

  public async listarPatrimonios(): Promise<PatrimonioComUnidades[]> {
    return prisma.item.findMany({
      include: {
        unidades: {
          include: { ambiente: true }
        }
      }
    });
  }

  public async criarPatrimonio(data: CriarPatrimonioDTO): Promise<Patrimonio> {
    return prisma.item.create({ data });
  }

  public async atualizarPatrimonio(id: string, data: AtualizarPatrimonioDTO): Promise<void> {
    await prisma.item.update({ where: { id }, data });
  }

  public async excluirPatrimonio(id: string): Promise<void> {
    await prisma.item.delete({ where: { id } });
  }
}
