import type { Request, Response } from "express";
import type { AtualizarBlocoDTO, CriarBlocoDTO } from "../dtos/bloco.dto";
import { BlocosRepository } from "../repositories/blocos.repository";
import { BlocoService } from "../services/bloco.service";

export class BlocoHandler {
    constructor(private readonly blocoService: BlocoService) {}

    public async listarBlocos(_req: Request, res: Response): Promise<void> {
        const blocos = await this.blocoService.listarBlocos();
        res.status(200).json(blocos);
    }

    public async obterBloco(req: Request<{ id: string }>, res: Response): Promise<void> {
        const bloco = await this.blocoService.obterBlocoPorId(req.params.id);
        res.status(200).json(bloco);
    }

    public async criarBloco(req: Request<{}, {}, CriarBlocoDTO>, res: Response): Promise<void> {
        const bloco = await this.blocoService.criarBloco(req.body);
        res.status(201).json(bloco);
    }

    public async atualizarBloco(
        req: Request<{ id: string }, {}, AtualizarBlocoDTO>,
        res: Response
    ): Promise<void> {
        await this.blocoService.atualizarBloco(req.params.id, req.body);
        res.status(200).json({ message: "Bloco atualizado com sucesso." });
    }

    public async deletarBloco(req: Request<{ id: string }>, res: Response): Promise<void> {
        await this.blocoService.deletarBloco(req.params.id);
        res.status(200).json({ message: "Bloco deletado com sucesso." });
    }
}

export const blocoHandler = new BlocoHandler(new BlocoService(new BlocosRepository()));
