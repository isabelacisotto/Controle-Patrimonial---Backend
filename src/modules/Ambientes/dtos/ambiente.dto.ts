import type { UnidadeItem } from "../../Patrimonio/dtos/patrimonio.dto"

export interface Ambiente {
    id: string;
    nome: string;
    responsavel: string;
    blocoId: string;
}

export interface Bloco {
    numero: number
}

export interface AmbienteItens {
    unidades: UnidadeItem
}