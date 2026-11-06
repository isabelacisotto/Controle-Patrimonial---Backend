import type { CriarMovimentacaoDTO } from "../../dtos/movimentacao.dto";

export function validarCriacaoMovimentacao(data: CriarMovimentacaoDTO): void {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("Os dados da movimentação são inválidos.");
  }

  const campos = [
    ["unidadeItemId", data.unidadeItemId, "A unidade do patrimônio é obrigatória."],
    ["origem", data.origem, "A origem da movimentação é obrigatória."],
    ["destino", data.destino, "O destino da movimentação é obrigatório."],
    ["resp", data.resp, "O responsável pela movimentação é obrigatório."]
  ] as const;

  for (const [campo, valor, mensagem] of campos) {
    if (typeof valor !== "string" || !valor.trim()) {
      throw new Error(mensagem);
    }
    if (!(campo in data)) {
      throw new Error(mensagem);
    }
  }
}
