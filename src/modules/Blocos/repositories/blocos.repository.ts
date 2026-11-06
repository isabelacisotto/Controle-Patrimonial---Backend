import { prisma } from "../../../../prisma/prisma";
import type { AtualizarBlocoDTO, Bloco, BlocoComAmbientes, CriarBlocoDTO } from "../dtos/bloco.dto";

export class BlocosRepository {
    public async obterBlocoPorId(id: string): Promise<BlocoComAmbientes | null> {
        return prisma.bloco.findUnique({
            where: { id },
            include: { ambientes: true }
        });
    }

    public async listarBlocos(): Promise<BlocoComAmbientes[]> {
        return prisma.bloco.findMany({
            include: { ambientes: true }
        });
    }

    public async criarBloco(data: CriarBlocoDTO): Promise<Bloco> {
        return prisma.bloco.create({ data });
    }

    public async atualizarBloco(id: string, data: AtualizarBlocoDTO): Promise<void> {
        await prisma.bloco.update({ where: { id }, data });
    }

    public async excluirBloco(id: string): Promise<void> {
        await prisma.bloco.delete({ where: { id } });
    }
}
