import { randomUUID } from 'node:crypto'

export class MemoriaDataBase {
    #hospedagem = new Map();

    // Listar Hospedagens (com ou sem a busca)
    list(search) {
        return Array.from(this.#hospedagem.entries()).map(([id, data]) => ({
            id,
            ...data,
        }))
        .filter(hospedagem => {
            if (search) {
                return hospedagem.hotel.toLowerCase().includes(search.toLowerCase());
            }
            return true;
        });
    }

    // Criando uma nova hospedagem
    create(data) {
        const id = randomUUID();
        this.#hospedagem.set(id, data);
        return { id, ...data };
    }
    
    // Atualizando uma hospedagem
    update(id, data) {
        if (this.#hospedagem.has(id)) {
            this.#hospedagem.set(id, data);
            return { id, ...data };
        }
        return null;
    }

    // Atualizando parcialmente uma hospedagem
    updatePartial(id, updates) {
        const hospedagem = this.#hospedagem.get(id);
        if (!hospedagem) return null;

        const updatedHospedagem = { ...hospedagem, ...updates };
        this.#hospedagem.set(id, updatedHospedagem);
        return { id, ...updatedHospedagem };
    }

    // Excluindo uma hospedagem
    delete(id) {
        if (this.#hospedagem.has(id)) {
            this.#hospedagem.delete(id);
            return true;
        }
        return null;
    }

    // Buscar hospedagem pelo ID
    getById(id) {
        if (this.#hospedagem.has(id)) {
            const data = this.#hospedagem.get(id);
            return { id, ...data };
        }
        return null;
    }
}
