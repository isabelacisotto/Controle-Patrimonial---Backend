import type { CriarMovimentacaoDTO, Movimentacao } from "../dtos/movimentacao.dto";
import { MovimentacaoRepository } from "../repositories/movimentacao.repository";
import { validarCriacaoMovimentacao } from "../utils/validations/movimentacao.validations";

export class MovimentacaoService {
  constructor(private readonly movimentacaoRepository: MovimentacaoRepository) {}

  public async listarMovimentacoes(): Promise<Movimentacao[]> {
    return this.movimentacaoRepository.listarMovimentacoes();
  }

  public async obterMovimentacaoPorId(id: string): Promise<Movimentacao> {
    const movimentacao = await this.movimentacaoRepository.obterMovimentacaoPorId(id);
    if (!movimentacao) {
      throw new Error("Movimentação não encontrada.");
    }
    return movimentacao;
  }

  public async criarMovimentacao(data: CriarMovimentacaoDTO): Promise<Movimentacao> {
    validarCriacaoMovimentacao(data);
    if (!await this.movimentacaoRepository.unidadeItemExiste(data.unidadeItemId)) {
      throw new Error("Unidade de patrimônio não encontrada.");
    }
    return this.movimentacaoRepository.criarMovimentacao(data);
  }
}
