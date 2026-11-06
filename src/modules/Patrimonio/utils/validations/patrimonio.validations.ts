import { Categoria } from "../../../../../prisma/generated/prisma/enums";
import type {
  AtualizarPatrimonioDTO,
  CriarPatrimonioDTO
} from "../../dtos/patrimonio.dto";

export function validarCriacaoPatrimonio(data: CriarPatrimonioDTO): void {
  validarDadosPatrimonio(data, true);
}

export function validarAtualizacaoPatrimonio(data: AtualizarPatrimonioDTO): void {
  validarDadosPatrimonio(data);
}

function validarDadosPatrimonio(
  data: CriarPatrimonioDTO | AtualizarPatrimonioDTO,
  exigirCamposObrigatorios = false
): void {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("Os dados do patrimônio são inválidos.");
  }

  if (exigirCamposObrigatorios &&
    (data.tombamento === undefined ||
      data.nome === undefined ||
      data.valor === undefined ||
      data.categoria === undefined ||
      data.marca === undefined ||
      data.quantidade === undefined)) {
    throw new Error("Preencha todos os campos obrigatórios do patrimônio.");
  }

  if ("tombamento" in data && data.tombamento !== undefined &&
    (!Number.isInteger(data.tombamento) || data.tombamento < 0)) {
    throw new Error("O tombamento deve ser um número inteiro não negativo.");
  }
  if ("nome" in data && data.nome !== undefined &&
    (typeof data.nome !== "string" || !data.nome.trim())) {
    throw new Error("O nome do patrimônio é obrigatório.");
  }
  if ("valor" in data && data.valor !== undefined &&
    (!Number.isFinite(data.valor) || data.valor < 0)) {
    throw new Error("O valor do patrimônio deve ser um número não negativo.");
  }
  if ("categoria" in data && data.categoria !== undefined &&
    !Object.values(Categoria).includes(data.categoria)) {
    throw new Error("Categoria de patrimônio inválida.");
  }
  if ("marca" in data && data.marca !== undefined &&
    (typeof data.marca !== "string" || !data.marca.trim())) {
    throw new Error("A marca do patrimônio é obrigatória.");
  }
  if ("quantidade" in data && data.quantidade !== undefined &&
    (!Number.isInteger(data.quantidade) || data.quantidade < 0)) {
    throw new Error("A quantidade deve ser um número inteiro não negativo.");
  }

  if (("tombamento" in data && data.tombamento === undefined) ||
    ("nome" in data && data.nome === undefined) ||
    ("valor" in data && data.valor === undefined) ||
    ("categoria" in data && data.categoria === undefined) ||
    ("marca" in data && data.marca === undefined) ||
    ("quantidade" in data && data.quantidade === undefined)) {
    throw new Error("Os campos informados devem conter valores válidos.");
  }
}
