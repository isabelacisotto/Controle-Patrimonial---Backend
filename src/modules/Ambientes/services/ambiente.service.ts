import type { Ambiente } from "../dtos/ambiente.dto";
import { AmbientesRepository } from "../repositories/ambientes.repository";

export class AmbienteService {
    constructor(private readonly ambienteRepository: AmbientesRepository) {}

    public async listarAmbientes(): Promise<Ambiente[]> {
        const ambientes = await this.ambienteRepository.listarAmbientes();
        return ambientes;
    }

    public async criarAmbiente(data: Ambiente): Promise<void> {
        const novoAmbiente: Ambiente = { ...data };
        if (!novoAmbiente.id || !novoAmbiente.nome || !novoAmbiente.responsavel || !novoAmbiente.blocoId) {
            throw new Error("Todos os campos são obrigatórios.");
        }
        await this.ambienteRepository.criarAmbiente(novoAmbiente);
    }

    public async atualizarAmbiente(id: string, data: Partial<Ambiente>): Promise<void> {
        const ambienteExistente = await this.ambienteRepository.obterAmbientePorId(id);
        if (!ambienteExistente) {
            throw new Error("Ambiente não encontrado.");
        }
        const ambienteAtualizado: Ambiente = { ...ambienteExistente, ...data };
        await this.ambienteRepository.atualizarAmbiente(id, ambienteAtualizado);
    }

    public async deletarAmbiente(id: string): Promise<void> {
        const ambienteExistente = await this.ambienteRepository.obterAmbientePorId(id);
        if (!ambienteExistente) {
            throw new Error("Ambiente não encontrado.");
        }
        await this.ambienteRepository.excluirAmbiente(id);
    }
}

export default new AmbienteService(new AmbientesRepository());