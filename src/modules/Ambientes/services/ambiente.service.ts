import type { Ambiente } from "../dtos/ambiente.dto";
import { AmbientesRepository } from "../repositories/ambientes.repository";

export class AmbienteService {
    constructor(private readonly ambienteRepository: AmbientesRepository) {}

    public async listarAmbientes(): Promise<Ambiente[]> {
        const ambientes = await this.ambienteRepository.listarAmbientes();
        return ambientes
    }

    public async criarAmbiente(): Promise<void> {
        const 
    }
}