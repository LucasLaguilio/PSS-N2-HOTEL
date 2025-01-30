// Importa o fastify
import { fastify } from "fastify";
// Importa DatabaseMemory
import { MemoriaDataBase } from "./database-memory.js";
// Cria o servidor
const server = fastify();
// Cria database
const database = new MemoriaDataBase();

// Ler a hospedagem
server.get('/hospedagens', (request) => {
    // Pega a busca
    const search = request.query.search;
    // Acessa a database
    const hospedagem = database.list(search);
    // Retorna a hospedagem
    return hospedagem;
});

// Criando um novo pedido de hospedagem
server.post('/hospedagens', (request, reply) => {
    const { hotel, hospede, quarto, checkin, checkout, nhospedes } = request.body;

    // Cria a hospedagem
    database.create({
        hotel, hospede, quarto, checkin, checkout, nhospedes
    });

    // Apenas retorna um status 201 (Criado) sem dados
    return reply.status(201).send();
});

// Atualizando uma hospedagem
server.put('/hospedagens/:id', (request, reply) => {
    const hospedagensId = request.params.id;
    const { hotel, hospede, quarto, nhospedes, checkin, checkout } = request.body;

    const hospedagens = database.update(hospedagensId, {
        hotel, hospede, quarto, checkin, checkout, nhospedes
    });

    if (!hospedagens) {
        return reply.status(404).send({ error: "Hospedagem não encontrada." });
    }

    return reply.status(204).send(hospedagens);
});

// Atualizando parcialmente uma hospedagem
server.patch('/hospedagens/:id', (request, reply) => {
    const hospedagensId = request.params.id;
    const atualizar = request.body;

    // Verifica se a hospedagem existe
    const hospedagensExistente = database.getById(hospedagensId);
    
    if (!hospedagensExistente) {
        return reply.status(404).send({ error: "Hospedagem não encontrada" });
    }

    // Atualiza apenas os campos enviados
    const hospedagensAtualizada = database.updatePartial(hospedagensId, atualizar);

    return reply.status(200).send(hospedagensAtualizada);
});

// Deletando uma hospedagem
server.delete('/hospedagens/:id', (request, reply) => {
    const hospedagensId = request.params.id;
    const sucesso = database.delete(hospedagensId);

    if (!sucesso) {
        return reply.status(404).send({ error: "Hospedagem não encontrada" });
    }

    return reply.status(204).send();
});

// Inicia o servidor
server.listen({
    port: 3333,
});