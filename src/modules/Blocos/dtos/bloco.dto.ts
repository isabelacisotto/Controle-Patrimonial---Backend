import type { Ambiente } from "../../Ambientes/dtos/ambiente.dto";

export interface Bloco {
    id: string;
    numero: number | null;
}

export interface BlocoComAmbientes extends Bloco {
    ambientes: Ambiente[];
}

export interface CriarBlocoDTO {
    numero?: number | null;
}

export type AtualizarBlocoDTO = Partial<CriarBlocoDTO>;
