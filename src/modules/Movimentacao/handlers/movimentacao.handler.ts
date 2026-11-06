import type { Request, Response } from "express";
import type { CriarMovimentacaoDTO } from "../dtos/movimentacao.dto";
import { MovimentacaoRepository } from "../repositories/movimentacao.repository";
import { MovimentacaoService } from "../services/movimentacao.service";

export class MovimentacaoHandler {
  constructor(private readonly movimentacaoService: MovimentacaoService) {}

  public async listarMovimentacoes(_req: Request, res: Response): Promise<void> {
    const movimentacoes = await this.movimentacaoService.listarMovimentacoes();
    res.status(200).json(movimentacoes);
  }

  public async obterMovimentacao(req: Request<{ id: string }>, res: Response): Promise<void> {
    const movimentacao = await this.movimentacaoService.obterMovimentacaoPorId(req.params.id);
    res.status(200).json(movimentacao);
  }

  public async criarMovimentacao(
    req: Request<{}, {}, CriarMovimentacaoDTO>,
    res: Response
  ): Promise<void> {
    const movimentacao = await this.movimentacaoService.criarMovimentacao(req.body);
    res.status(201).json(movimentacao);
  }
}

export const movimentacaoHandler = new MovimentacaoHandler(
  new MovimentacaoService(new MovimentacaoRepository())
);
