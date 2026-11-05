import { prisma } from "../../../../prisma/prisma";
import type { Ambiente } from "../dtos/ambiente.dto";

export class AmbientesRepository {
  public async listarAmbientes(): Promise<Ambiente[]> {
    const ambientes = await prisma.ambiente.findMany({ 
        include: { 
            unidades: { 
                include: { 
                    item: true, 
                    ambiente: true 
                } 
            } 
        }
    });

    return ambientes
  }

  public async criarAmbiente({ nome, responsavel, blocoId }: Ambiente): Promise<void> {
    await prisma.ambiente.create({  
      data: {
        nome,
        responsavel,
        bloco: {
          connect: {
            id: blocoId
          }
        }
      }
    })
  }

  public async atualizarAmbiente(id: string, data: Partial<Ambiente>): Promise<void> {
    await prisma.ambiente.update({ where: { id }, data })
  }

  public async excluirAmbiente(id: string): Promise<void> {
    await prisma.ambiente.delete({ where: { id } })
  }
}

export default new AmbientesRepository();