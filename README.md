# Mini-ERP

Mini sistema de gestão (estoque, pedidos de compra e fornecedores) para uma
empresa fictícia, construído como projeto de estudo full stack: React/TypeScript
no front, .NET e Node.js no back (duas implementações do mesmo contrato REST),
PostgreSQL, Scrumban, e as duas migrações arquiteturais monolito → microsserviços.

**Demo ao vivo (front-end contra API mockada):** https://titular33.github.io/mini-erp/

Login de demonstração: `admin@erp.local` / `admin123`

## Estrutura

```
mini-erp/
├── backend-dotnet/   # API REST em C#/.NET (em construção)
├── backend-node/     # API REST equivalente em Node/TypeScript (em construção)
├── frontend/         # SPA React + TypeScript
├── db/               # migrations e scripts do PostgreSQL (em construção)
└── docs/
    ├── api-contract.md   # contrato REST que ambos back-ends implementam
    └── backlog.md        # backlog, sprints e board Kanban
```

## Rodando localmente

```bash
cd frontend
npm install
npm run dev
```

A API é mockada via MSW enquanto os back-ends reais não estão prontos —
não é necessário nenhum serviço externo para rodar o front localmente.

## Documentação

- [Contrato de API](docs/api-contract.md)
- [Backlog e Kanban](docs/backlog.md)
