import type {
  AtualizarEstadoUnidadeDTO,
  AtualizarPatrimonioDTO,
  CriarPatrimonioDTO,
  PatrimonioComUnidades
} from "../dtos/patrimonio.dto";
import { EstadoItem } from "../../../../prisma/generated/prisma/enums";
import {
  PatrimonioRepository,
  type ResultadoExclusaoPatrimonio
} from "../repositories/patrimonio.repository";
import {
  validarAtualizacaoPatrimonio,
  validarCriacaoPatrimonio
} from "../utils/validations/patrimonio.validations";

export class ErroExclusaoPatrimonio extends Error {
  constructor(
    public readonly status: 404 | 409,
    message: string,
  ) {
    super(message);
    this.name = "ErroExclusaoPatrimonio";
  }
}

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

  public async criarPatrimonio(data: CriarPatrimonioDTO): Promise<PatrimonioComUnidades> {
    validarCriacaoPatrimonio(data);
    if (data.ambienteId && !(await this.patrimonioRepository.ambienteExiste(data.ambienteId))) {
      throw new Error("Ambiente não encontrado.");
    }
    return this.patrimonioRepository.criarPatrimonio(data);
  }

  public async atualizarPatrimonio(id: string, data: AtualizarPatrimonioDTO): Promise<void> {
    await this.obterPatrimonioPorId(id);
    validarAtualizacaoPatrimonio(data);
    await this.patrimonioRepository.atualizarPatrimonio(id, data);
  }

  public async deletarPatrimonio(id: string): Promise<void> {
    const resultado: ResultadoExclusaoPatrimonio =
      await this.patrimonioRepository.excluirPatrimonio(id);
    if (resultado === "nao_encontrado") {
      throw new ErroExclusaoPatrimonio(404, "Patrimônio não encontrado.");
    }
    if (resultado === "possui_movimentacoes") {
      throw new ErroExclusaoPatrimonio(
        409,
        "Não é possível excluir um patrimônio com movimentações registradas.",
      );
    }
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
