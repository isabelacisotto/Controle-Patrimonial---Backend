import type { Request, Response } from "express";
import type {
  AtualizarPatrimonioDTO,
  CriarPatrimonioDTO
} from "../dtos/patrimonio.dto";
import { PatrimonioRepository } from "../repositories/patrimonio.repository";
import { PatrimonioService } from "../services/patrimonio.service";

export class PatrimonioHandler {
  constructor(private readonly patrimonioService: PatrimonioService) {}

  public async listarPatrimonios(_req: Request, res: Response): Promise<void> {
    const patrimonios = await this.patrimonioService.listarPatrimonios();
    res.status(200).json(patrimonios);
  }

  public async obterPatrimonio(req: Request<{ id: string }>, res: Response): Promise<void> {
    const patrimonio = await this.patrimonioService.obterPatrimonioPorId(req.params.id);
    res.status(200).json(patrimonio);
  }

  public async criarPatrimonio(
    req: Request<{}, {}, CriarPatrimonioDTO>,
    res: Response
  ): Promise<void> {
    const patrimonio = await this.patrimonioService.criarPatrimonio(req.body);
    res.status(201).json(patrimonio);
  }

  public async atualizarPatrimonio(
    req: Request<{ id: string }, {}, AtualizarPatrimonioDTO>,
    res: Response
  ): Promise<void> {
    await this.patrimonioService.atualizarPatrimonio(req.params.id, req.body);
    res.status(200).json({ message: "Patrimônio atualizado com sucesso." });
  }

  public async deletarPatrimonio(req: Request<{ id: string }>, res: Response): Promise<void> {
    await this.patrimonioService.deletarPatrimonio(req.params.id);
    res.status(200).json({ message: "Patrimônio deletado com sucesso." });
  }
}

export const patrimonioHandler = new PatrimonioHandler(
  new PatrimonioService(new PatrimonioRepository())
);
