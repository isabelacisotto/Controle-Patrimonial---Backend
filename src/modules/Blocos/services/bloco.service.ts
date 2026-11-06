import type { AtualizarBlocoDTO, Bloco, BlocoComAmbientes, CriarBlocoDTO } from "../dtos/bloco.dto";
import { BlocosRepository } from "../repositories/blocos.repository";

export class BlocoService {
    constructor(private readonly blocosRepository: BlocosRepository) {}

    public async listarBlocos(): Promise<BlocoComAmbientes[]> {
        return this.blocosRepository.listarBlocos();
    }

    public async obterBlocoPorId(id: string): Promise<BlocoComAmbientes> {
        const bloco = await this.blocosRepository.obterBlocoPorId(id);
        if (!bloco) {
            throw new Error("Bloco não encontrado.");
        }
        return bloco;
    }

    public async criarBloco(data: CriarBlocoDTO): Promise<Bloco> {
        this.validarNumero(data.numero);
        return this.blocosRepository.criarBloco(data);
    }

    public async atualizarBloco(id: string, data: AtualizarBlocoDTO): Promise<void> {
        await this.obterBlocoPorId(id);
        this.validarNumero(data.numero);
        await this.blocosRepository.atualizarBloco(id, data);
    }

    public async deletarBloco(id: string): Promise<void> {
        const bloco = await this.obterBlocoPorId(id);
        if (bloco.ambientes.length > 0) {
            throw new Error("Não é possível excluir um bloco que possui ambientes.");
        }
        await this.blocosRepository.excluirBloco(id);
    }

    private validarNumero(numero: number | null | undefined): void {
        if (numero !== undefined && numero !== null && !Number.isInteger(numero)) {
            throw new Error("O número do bloco deve ser um inteiro.");
        }
    }
}
