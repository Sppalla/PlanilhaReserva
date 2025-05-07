const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Criar conexão com o banco de dados
const db = new sqlite3.Database(path.join(__dirname, 'pedidos.db'), (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
    } else {
        console.log('Conectado ao banco de dados SQLite');
        criarTabelas();
    }
});

// Função para criar as tabelas necessárias
function criarTabelas() {
    // Tabela de pedidos de clientes
    db.run(`CREATE TABLE IF NOT EXISTS pedidos_clientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        numero TEXT,
        data TEXT,
        cliente TEXT,
        material TEXT,
        espessura TEXT,
        modelo TEXT,
        cor TEXT,
        quantidade INTEGER,
        tamanho TEXT,
        vendedor TEXT,
        status TEXT,
        prazo TEXT
    )`);

    // Tabela de pedidos de produção
    db.run(`CREATE TABLE IF NOT EXISTS pedidos_producao (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        numero TEXT,
        data TEXT,
        material TEXT,
        espessura TEXT,
        modelo TEXT,
        cor TEXT,
        quantidade INTEGER,
        tamanho TEXT,
        responsavel TEXT,
        status TEXT,
        prazo TEXT
    )`);

    // Tabela de pedidos concluídos
    db.run(`CREATE TABLE IF NOT EXISTS pedidos_concluidos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        numero TEXT,
        data TEXT,
        material TEXT,
        espessura TEXT,
        modelo TEXT,
        cor TEXT,
        quantidade INTEGER,
        tamanho TEXT,
        responsavel TEXT,
        status TEXT,
        prazo TEXT
    )`);
}

// Funções para manipular pedidos de clientes
const pedidosClientes = {
    adicionar: (pedido) => {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO pedidos_clientes (
                numero, data, cliente, material, espessura, modelo, 
                cor, quantidade, tamanho, vendedor, status, prazo
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            
            db.run(sql, [
                pedido.numero, pedido.data, pedido.cliente, pedido.material,
                pedido.espessura, pedido.modelo, pedido.cor, pedido.quantidade,
                pedido.tamanho, pedido.vendedor, pedido.status, pedido.prazo
            ], function(err) {
                if (err) reject(err);
                else resolve(this.lastID);
            });
        });
    },

    atualizar: (id, pedido) => {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE pedidos_clientes SET 
                numero = ?, data = ?, cliente = ?, material = ?, 
                espessura = ?, modelo = ?, cor = ?, quantidade = ?, 
                tamanho = ?, vendedor = ?, status = ?, prazo = ?
                WHERE id = ?`;
            
            db.run(sql, [
                pedido.numero, pedido.data, pedido.cliente, pedido.material,
                pedido.espessura, pedido.modelo, pedido.cor, pedido.quantidade,
                pedido.tamanho, pedido.vendedor, pedido.status, pedido.prazo, id
            ], function(err) {
                if (err) reject(err);
                else resolve(this.changes);
            });
        });
    },

    excluir: (id) => {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM pedidos_clientes WHERE id = ?', [id], function(err) {
                if (err) reject(err);
                else resolve(this.changes);
            });
        });
    },

    listar: () => {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM pedidos_clientes', [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }
};

// Funções para manipular pedidos de produção
const pedidosProducao = {
    adicionar: (pedido) => {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO pedidos_producao (
                numero, data, material, espessura, modelo, 
                cor, quantidade, tamanho, responsavel, status, prazo
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            
            db.run(sql, [
                pedido.numero, pedido.data, pedido.material,
                pedido.espessura, pedido.modelo, pedido.cor, pedido.quantidade,
                pedido.tamanho, pedido.responsavel, pedido.status, pedido.prazo
            ], function(err) {
                if (err) reject(err);
                else resolve(this.lastID);
            });
        });
    },

    atualizar: (id, pedido) => {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE pedidos_producao SET 
                numero = ?, data = ?, material = ?, espessura = ?, 
                modelo = ?, cor = ?, quantidade = ?, tamanho = ?, 
                responsavel = ?, status = ?, prazo = ?
                WHERE id = ?`;
            
            db.run(sql, [
                pedido.numero, pedido.data, pedido.material,
                pedido.espessura, pedido.modelo, pedido.cor, pedido.quantidade,
                pedido.tamanho, pedido.responsavel, pedido.status, pedido.prazo, id
            ], function(err) {
                if (err) reject(err);
                else resolve(this.changes);
            });
        });
    },

    excluir: (id) => {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM pedidos_producao WHERE id = ?', [id], function(err) {
                if (err) reject(err);
                else resolve(this.changes);
            });
        });
    },

    listar: () => {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM pedidos_producao', [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }
};

// Funções para manipular pedidos concluídos
const pedidosConcluidos = {
    adicionar: (pedido) => {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO pedidos_concluidos (
                numero, data, material, espessura, modelo, 
                cor, quantidade, tamanho, responsavel, status, prazo
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            
            db.run(sql, [
                pedido.numero, pedido.data, pedido.material,
                pedido.espessura, pedido.modelo, pedido.cor, pedido.quantidade,
                pedido.tamanho, pedido.responsavel, pedido.status, pedido.prazo
            ], function(err) {
                if (err) reject(err);
                else resolve(this.lastID);
            });
        });
    },

    excluir: (id) => {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM pedidos_concluidos WHERE id = ?', [id], function(err) {
                if (err) reject(err);
                else resolve(this.changes);
            });
        });
    },

    listar: () => {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM pedidos_concluidos', [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }
};

module.exports = {
    db,
    pedidosClientes,
    pedidosProducao,
    pedidosConcluidos
}; 