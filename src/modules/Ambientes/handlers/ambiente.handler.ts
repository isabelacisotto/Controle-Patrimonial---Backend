import e from "express";
import type { Ambiente } from "../dtos/ambiente.dto";
import { AmbienteService } from "../services/ambiente.service";
import type { Request, Response } from "express";
import { AmbientesRepository } from "../repositories/ambientes.repository";

export class AmbienteHandler {
    constructor(private readonly ambienteService: AmbienteService) {}

    public async listarAmbientes(req: Request, res: Response): Promise<void> {
        const ambientes = await this.ambienteService.listarAmbientes();
        res.status(200).json(ambientes);
    }

    public async criarAmbiente(req: Request, res: Response): Promise<void> {
        const data: Ambiente = req.body;
        await this.ambienteService.criarAmbiente(data);
        res.status(201).json({ message: "Ambiente criado com sucesso." });
    }

    public async atualizarAmbiente(req: Request<{ id: string }, Partial<Ambiente>>, res: Response): Promise<void> {
        const { id } = req.params;
        const data: Partial<Ambiente> = req.body;
        await this.ambienteService.atualizarAmbiente(id, data);
        res.status(200).json({ message: "Ambiente atualizado com sucesso." });
    }

    public async deletarAmbiente(req: Request<{ id: string }>, res: Response): Promise<void> {
        const { id } = req.params;
        await this.ambienteService.deletarAmbiente(id);
        res.status(200).json({ message: "Ambiente deletado com sucesso." });
    }
}

export const ambienteHandler = new AmbienteHandler(new AmbienteService(new AmbientesRepository()));