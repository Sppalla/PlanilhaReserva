# Sistema de Gerenciamento de Pedidos

Este é um sistema para gerenciamento de pedidos de clientes, produção e pedidos concluídos.

## Funcionalidades

- Cadastro de pedidos de clientes
- Gerenciamento de pedidos em produção
- Controle de pedidos concluídos
- Agrupamento de pedidos por material
- Sistema de cores para identificação visual
- Banco de dados SQLite para persistência dos dados

## Requisitos

- Node.js (versão 14 ou superior)
- NPM (gerenciador de pacotes do Node.js)

## Instalação

1. Clone este repositório
2. Instale as dependências:
```bash
npm install
```

## Executando o projeto

Para iniciar o sistema:
```bash
npm start
```

## Estrutura do Banco de Dados

O sistema utiliza SQLite com as seguintes tabelas:

### pedidos_clientes
- id (INTEGER PRIMARY KEY)
- numero (TEXT)
- data (TEXT)
- cliente (TEXT)
- material (TEXT)
- espessura (TEXT)
- modelo (TEXT)
- cor (TEXT)
- quantidade (INTEGER)
- tamanho (TEXT)
- vendedor (TEXT)
- status (TEXT)
- prazo (TEXT)

### pedidos_producao
- id (INTEGER PRIMARY KEY)
- numero (TEXT)
- data (TEXT)
- material (TEXT)
- espessura (TEXT)
- modelo (TEXT)
- cor (TEXT)
- quantidade (INTEGER)
- tamanho (TEXT)
- responsavel (TEXT)
- status (TEXT)
- prazo (TEXT)

### pedidos_concluidos
- id (INTEGER PRIMARY KEY)
- numero (TEXT)
- data (TEXT)
- material (TEXT)
- espessura (TEXT)
- modelo (TEXT)
- cor (TEXT)
- quantidade (INTEGER)
- tamanho (TEXT)
- responsavel (TEXT)
- status (TEXT)
- prazo (TEXT)

## Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request 