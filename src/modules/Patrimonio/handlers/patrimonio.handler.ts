import type { Request, Response } from "express";
import type {
  AtualizarEstadoUnidadeDTO,
  AtualizarPatrimonioDTO,
  CriarPatrimonioDTO
} from "../dtos/patrimonio.dto";
import { PatrimonioRepository } from "../repositories/patrimonio.repository";
import {
  ErroExclusaoPatrimonio,
  PatrimonioService
} from "../services/patrimonio.service";

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
    try {
      await this.patrimonioService.deletarPatrimonio(req.params.id);
      res.status(200).json({ message: "Patrimônio deletado com sucesso." });
    } catch (error) {
      if (error instanceof ErroExclusaoPatrimonio) {
        res.status(error.status).json({ message: error.message });
        return;
      }
      throw error;
    }
  }

  public async atualizarEstadoUnidade(
    req: Request<{ id: string }, {}, AtualizarEstadoUnidadeDTO>,
    res: Response,
  ): Promise<void> {
    await this.patrimonioService.atualizarEstadoUnidade(req.params.id, req.body);
    res.status(200).json({ message: "Situação da unidade atualizada com sucesso." });
  }
}

export const patrimonioHandler = new PatrimonioHandler(
  new PatrimonioService(new PatrimonioRepository())
);
