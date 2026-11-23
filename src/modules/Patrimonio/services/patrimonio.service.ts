import type {
  AtualizarEstadoUnidadeDTO,
  AtualizarPatrimonioDTO,
  CriarPatrimonioDTO,
  Patrimonio,
  PatrimonioComUnidades
} from "../dtos/patrimonio.dto";
import { EstadoItem } from "../../../../prisma/generated/prisma/enums";
import { PatrimonioRepository } from "../repositories/patrimonio.repository";
import {
  validarAtualizacaoPatrimonio,
  validarCriacaoPatrimonio
} from "../utils/validations/patrimonio.validations";

export class PatrimonioService {
  constructor(private readonly patrimonioRepository: PatrimonioRepository) {}

  public async listarPatrimonios(): Promise<PatrimonioComUnidades[]> {
    return this.patrimonioRepository.listarPatrimonios();
  }

  public async obterPatrimonioPorId(id: string): Promise<PatrimonioComUnidades> {
    const patrimonio = await this.patrimonioRepository.obterPatrimonioPorId(id);
    if (!patrimonio) {
      throw new Error("Patrimônio não encontrado.");
    }
    return patrimonio;
  }

  public async criarPatrimonio(data: CriarPatrimonioDTO): Promise<Patrimonio> {
    validarCriacaoPatrimonio(data);
    return this.patrimonioRepository.criarPatrimonio(data);
  }

  public async atualizarPatrimonio(id: string, data: AtualizarPatrimonioDTO): Promise<void> {
    await this.obterPatrimonioPorId(id);
    validarAtualizacaoPatrimonio(data);
    await this.patrimonioRepository.atualizarPatrimonio(id, data);
  }

  public async deletarPatrimonio(id: string): Promise<void> {
    const patrimonio = await this.obterPatrimonioPorId(id);
    if (patrimonio.unidades.length > 0) {
      throw new Error("Não é possível excluir um patrimônio que possui unidades cadastradas.");
    }
    await this.patrimonioRepository.excluirPatrimonio(id);
  }

  public async atualizarEstadoUnidade(
    id: string,
    data: AtualizarEstadoUnidadeDTO,
  ): Promise<void> {
    if (!data || !Object.values(EstadoItem).includes(data.estado)) {
      throw new Error("Situação da unidade inválida.");
    }
    if (!(await this.patrimonioRepository.unidadeItemExiste(id))) {
      throw new Error("Unidade de patrimônio não encontrada.");
    }
    await this.patrimonioRepository.atualizarEstadoUnidade(id, data);
  }
}
