import type { CriarMovimentacaoDTO } from "../../dtos/movimentacao.dto";
import { ErroMovimentacao } from "../../errors/movimentacao.error";

export function validarCriacaoMovimentacao(data: CriarMovimentacaoDTO): void {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new ErroMovimentacao(400, "Os dados da movimentação são inválidos.");
  }

  const campos = [
    ["itemId", data.itemId, "O patrimônio é obrigatório."],
    ["destinoAmbienteId", data.destinoAmbienteId, "O ambiente de destino é obrigatório."],
    ["resp", data.resp, "O responsável pela movimentação é obrigatório."]
  ] as const;

  for (const [campo, valor, mensagem] of campos) {
    if (typeof valor !== "string" || !valor.trim()) {
      throw new ErroMovimentacao(400, mensagem);
    }
    if (!(campo in data)) {
      throw new ErroMovimentacao(400, mensagem);
    }
  }

  if (!("origemAmbienteId" in data) ||
    (data.origemAmbienteId !== null &&
      (typeof data.origemAmbienteId !== "string" || !data.origemAmbienteId.trim()))) {
    throw new ErroMovimentacao(400, "O ambiente de origem é inválido.");
  }
  if (!Number.isSafeInteger(data.quantidade) || data.quantidade < 1) {
    throw new ErroMovimentacao(400, "A quantidade deve ser um número inteiro maior que zero.");
  }

  if (typeof data.expiresAt !== "string" || !data.expiresAt.trim()) {
    throw new ErroMovimentacao(400, "A data e hora de expiração são obrigatórias.");
  }
  const expiracao = new Date(data.expiresAt);
  if (Number.isNaN(expiracao.getTime()) || expiracao.getTime() <= Date.now()) {
    throw new ErroMovimentacao(400, "A data e hora de expiração devem estar no futuro.");
  }
}
