const express = require('express');
const path = require('path');
const { db, pedidosClientes, pedidosProducao, pedidosConcluidos } = require('./database');

const app = express();
const port = 3000;

// Middleware para processar JSON
app.use(express.json());

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname)));

// Rota para obter todos os pedidos
app.get('/api/pedidos', async (req, res) => {
    try {
        const clientes = await pedidosClientes.listar();
        const producao = await pedidosProducao.listar();
        const concluidos = await pedidosConcluidos.listar();
        
        res.json({ clientes, producao, concluidos });
    } catch (err) {
        console.error('Erro ao obter pedidos:', err);
        res.status(500).json({ error: 'Erro ao obter pedidos' });
    }
});

// Rota para salvar pedidos
app.post('/api/pedidos', async (req, res) => {
    try {
        const { clientes, producao, concluidos } = req.body;
        
        // Limpar tabelas antes de inserir novos pedidos
        await new Promise((resolve, reject) => db.run('DELETE FROM pedidos_clientes', err => err ? reject(err) : resolve()));
        await new Promise((resolve, reject) => db.run('DELETE FROM pedidos_producao', err => err ? reject(err) : resolve()));
        await new Promise((resolve, reject) => db.run('DELETE FROM pedidos_concluidos', err => err ? reject(err) : resolve()));
        
        // Salvar pedidos de clientes
        for (const pedido of clientes) {
            await pedidosClientes.adicionar(pedido);
        }
        // Salvar pedidos de produção
        for (const pedido of producao) {
            await pedidosProducao.adicionar(pedido);
        }
        // Salvar pedidos concluídos
        for (const pedido of concluidos) {
            await pedidosConcluidos.adicionar(pedido);
        }
        
        res.json({ success: true });
    } catch (err) {
        console.error('Erro ao salvar pedidos:', err);
        res.status(500).json({ error: 'Erro ao salvar pedidos' });
    }
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
}); 