# Contrato de API — Mini-ERP

Este contrato é a fonte da verdade para o REST. As duas implementações de back-end
(.NET e Node) devem implementá-lo de forma idêntica; o front-end React consome
apenas este contrato (via mock primeiro, depois via API real).

Convenções gerais:
- Base path: `/api/v1`
- Content-Type: `application/json`
- Autenticação: JWT Bearer token no header `Authorization: Bearer <token>`, exceto em `/auth/login`
- IDs: UUID (string)
- Datas: ISO 8601 UTC (`2026-09-09T14:30:00Z`)
- Erros: ver seção "Formato de erro" no final

## Auth

### POST /auth/login
Request:
```json
{ "email": "admin@erp.local", "password": "string" }
```
Response `200`:
```json
{ "token": "jwt-string", "user": { "id": "uuid", "name": "string", "role": "admin | operator" } }
```
Response `401`: credenciais inválidas.

## Suppliers (Fornecedores)

- `GET /suppliers` — lista, suporta `?status=active|inactive` e `?search=`
- `GET /suppliers/{id}`
- `POST /suppliers` — cria
- `PUT /suppliers/{id}` — atualiza
- `PATCH /suppliers/{id}/status` — ativa/inativa (não permite delete físico — auditoria)

Supplier shape:
```json
{
  "id": "uuid",
  "name": "string",
  "taxId": "string (CNPJ)",
  "email": "string",
  "phone": "string",
  "status": "active | inactive",
  "createdAt": "iso-date"
}
```

## Products (Produtos)

- `GET /products` — lista, suporta `?belowMinStock=true`, `?search=`
- `GET /products/{id}`
- `POST /products`
- `PUT /products/{id}`

Product shape:
```json
{
  "id": "uuid",
  "sku": "string",
  "name": "string",
  "unit": "UN | KG | CX | L",
  "minStock": "number",
  "currentStock": "number (derivado, somente leitura — calculado a partir do ledger)",
  "averageCost": "number (derivado)"
}
```

## Inventory (Movimentações de estoque)

- `GET /inventory/movements?productId=` — lista o ledger de um produto
- `GET /inventory/position` — snapshot atual de estoque de todos os produtos (usado no dashboard)

Movement shape (somente leitura via API pública — criado internamente por outras operações, ex. recebimento de pedido):
```json
{
  "id": "uuid",
  "productId": "uuid",
  "type": "in | out",
  "quantity": "number",
  "unitCost": "number",
  "reason": "purchase_receipt | manual_adjustment",
  "referenceId": "uuid (ex: purchaseOrderId)",
  "createdAt": "iso-date"
}
```

## Purchase Orders (Pedidos de Compra)

- `GET /purchase-orders` — lista, suporta `?status=`
- `GET /purchase-orders/{id}` — inclui itens
- `POST /purchase-orders` — cria em status `draft`
- `POST /purchase-orders/{id}/submit` — draft → submitted
- `POST /purchase-orders/{id}/receive` — submitted → received (parcial ou total); gera movimentações de estoque
- `POST /purchase-orders/{id}/cancel` — draft|submitted → cancelled

PurchaseOrder shape:
```json
{
  "id": "uuid",
  "supplierId": "uuid",
  "status": "draft | submitted | received | partially_received | cancelled",
  "items": [
    {
      "id": "uuid",
      "productId": "uuid",
      "quantityOrdered": "number",
      "quantityReceived": "number",
      "unitPrice": "number"
    }
  ],
  "totalAmount": "number (derivado)",
  "createdAt": "iso-date"
}
```

Receive request body (permite recebimento parcial):
```json
{
  "items": [
    { "purchaseOrderItemId": "uuid", "quantityReceived": "number" }
  ]
}
```

## Dashboard

- `GET /dashboard/summary`
```json
{
  "totalStockValue": "number",
  "pendingPurchaseOrders": "number",
  "productsBelowMinStock": "number",
  "recentMovements": [ "Movement[]" ]
}
```

## Formato de erro

Todas as respostas de erro (4xx/5xx) seguem o mesmo shape:
```json
{
  "error": {
    "code": "VALIDATION_ERROR | NOT_FOUND | UNAUTHORIZED | CONFLICT | INTERNAL_ERROR",
    "message": "string legível",
    "details": [ { "field": "string", "message": "string" } ]
  }
}
```

Isso importa porque cada stack trata erros de forma bem diferente por baixo dos panos
(exceptions + middleware em .NET, error-handling middleware em Express/Node) — mas o
contrato exposto ao cliente tem que ser idêntico.
