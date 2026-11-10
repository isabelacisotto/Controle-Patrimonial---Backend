# Rotas da API

Este documento descreve as rotas registradas em `src/server.ts`.

## Informações gerais

- **Base URL local:** `http://localhost:3030`
- **Formato:** JSON. Envie `Content-Type: application/json` nas requisições com corpo.
- **Autenticação:** todas as rotas, exceto `/login`, `/register`, `/forgot-password` e `/update-password`, exigem `Authorization: Bearer <token>`.
- O token de login expira em 24 horas. Rotas protegidas respondem `401` com `{"message":"No token provided"}` quando não recebem token e `{"message":"Invalid token"}` quando a verificação falha.
- Datas são devolvidas em formato ISO. O campo monetário `valor` é um Decimal do Prisma e é serializado como string JSON.
- As validações e erros de banco são lançados pelos serviços, mas não há middleware de erro de aplicação registrado. Portanto, erros nessas rotas não têm um contrato JSON/status específico e podem resultar na resposta padrão de erro do Express.

## Usuários e autenticação

### `POST /register`

Cria uma conta.

**Entrada (JSON):**

```json
{
  "name": "Ana Silva",
  "email": "ana@example.com",
  "password": "senha123"
}
```

`name`, `email` e `password` são obrigatórios. O nome deve ter pelo menos 3 caracteres; a senha, pelo menos 8; e o e-mail deve ter formato válido. O e-mail precisa ser único. A senha é armazenada como hash. O papel (`role`) é definido como `USER` pelo banco.

**Saída — `201 Created`:**

```json
{
  "success": true,
  "status": 201,
  "message": "User created successfully"
}
```

### `POST /login`

Autentica um usuário e emite um token JWT válido por 24 horas.

**Entrada (JSON):**

```json
{
  "email": "ana@example.com",
  "password": "senha123"
}
```

E-mail e senha são obrigatórios; a senha deve ter pelo menos 8 caracteres.

**Saída — `200 OK`:**

```json
{
  "user": {
    "id": "uuid",
    "name": "Ana Silva",
    "email": "ana@example.com",
    "password": "<hash da senha>",
    "role": "USER",
    "createdAt": "2026-11-10T10:00:00.000Z"
  },
  "token": "<jwt>"
}
```

**Importante:** a resposta atual inclui `password` com o hash armazenado. Use o token nas rotas protegidas como `Authorization: Bearer <jwt>`.

### `POST /forgot-password`

Solicita o envio de um e-mail de recuperação.

**Entrada (JSON):**

```json
{
  "email": "ana@example.com"
}
```

**Saída — `200 OK`:**

```json
{
  "success": true,
  "status": 200,
  "message": "Password reset email sent"
}
```

**Importante:** o serviço envia um link com token de 15 minutos para `/update-password/<token>`, mas essa URL não está registrada. A rota de atualização disponível é `PUT /update-password` e não recebe nem verifica esse token. O envio depende de `EMAIL_USER` e `EMAIL_PASS`.

### `PUT /update-password`

Atualiza a senha de uma conta identificada pelo e-mail. Esta rota não exige autenticação.

**Entrada (JSON):**

```json
{
  "email": "ana@example.com",
  "password": "novaSenha123"
}
```

Ambos os campos são obrigatórios; o e-mail deve ser válido e a senha deve ter pelo menos 8 caracteres.

**Saída — `200 OK`:**

```json
{
  "success": true,
  "status": 200,
  "message": {
    "id": "uuid",
    "name": "Ana Silva",
    "email": "ana@example.com",
    "password": "<hash da nova senha>",
    "role": "USER",
    "createdAt": "2026-11-10T10:00:00.000Z"
  }
}
```

**Importante:** a resposta atual também inclui o hash da senha. A atualização não recebe nem valida um token de recuperação.

### `GET /protected`

Exemplo de rota protegida para validar o token.

**Entrada:** sem corpo; requer `Authorization: Bearer <token>`.

**Saída — `200 OK`:**

```json
{
  "message": "This is a protected route"
}
```

## Ambientes

Todas as rotas desta seção exigem autenticação.

### `GET /ambientes`

Lista ambientes, incluindo suas unidades e, para cada unidade, os dados do item e do ambiente associado.

**Entrada:** sem corpo.

**Saída — `200 OK`:** array de ambientes. Cada ambiente contém `id`, `nome`, `responsavel`, `blocoId` e `unidades`. Cada unidade contém seus dados, o item (`item`) e o ambiente (`ambiente`, que pode ser `null`).

```json
[
  {
    "id": "ambiente-uuid",
    "nome": "Sala 1",
    "responsavel": "Ana Silva",
    "blocoId": "bloco-uuid",
    "unidades": []
  }
]
```

### `POST /ambientes`

Cria um ambiente.

**Entrada (JSON):**

```json
{
  "id": "ambiente-uuid",
  "nome": "Sala 1",
  "responsavel": "Ana Silva",
  "blocoId": "bloco-uuid"
}
```

Todos os campos são exigidos pelo serviço. `blocoId` deve identificar um bloco existente. Embora `id` seja exigido na entrada, o repositório não o utiliza ao criar o registro; o banco gera o identificador.

**Saída — `201 Created`:**

```json
{
  "message": "Ambiente criado com sucesso."
}
```

### `PUT /ambientes/:id`

Atualiza um ambiente existente.

**Parâmetro:** `id` — identificador do ambiente.

**Entrada (JSON):** objeto parcial com qualquer campo do ambiente, por exemplo:

```json
{
  "nome": "Sala 2",
  "responsavel": "João Lima"
}
```

**Saída — `200 OK`:**

```json
{
  "message": "Ambiente atualizado com sucesso."
}
```

### `DELETE /ambientes/:id`

Exclui um ambiente existente.

**Parâmetro:** `id` — identificador do ambiente.

**Entrada:** sem corpo.

**Saída — `200 OK`:**

```json
{
  "message": "Ambiente deletado com sucesso."
}
```

## Blocos

Todas as rotas desta seção exigem autenticação.

### `GET /blocos`

Lista blocos incluindo os ambientes associados.

**Entrada:** sem corpo.

**Saída — `200 OK`:** array de blocos (`id`, `numero`) com `ambientes`.

```json
[
  {
    "id": "bloco-uuid",
    "numero": 1,
    "ambientes": []
  }
]
```

### `GET /blocos/:id`

Obtém um bloco e seus ambientes.

**Parâmetro:** `id` — identificador do bloco.

**Entrada:** sem corpo.

**Saída — `200 OK`:** objeto com `id`, `numero` e `ambientes`, como no item de `GET /blocos`.

### `POST /blocos`

Cria um bloco. `numero` é opcional e pode ser `null`; quando informado, deve ser inteiro.

**Entrada (JSON):**

```json
{
  "numero": 1
}
```

**Saída — `201 Created`:**

```json
{
  "id": "bloco-uuid",
  "numero": 1
}
```

O identificador é gerado pelo banco.

### `PUT /blocos/:id`

Atualiza o número de um bloco existente. O campo `numero` é opcional e aceita inteiro ou `null`.

**Parâmetro:** `id` — identificador do bloco.

**Entrada (JSON):**

```json
{
  "numero": 2
}
```

**Saída — `200 OK`:**

```json
{
  "message": "Bloco atualizado com sucesso."
}
```

### `DELETE /blocos/:id`

Exclui um bloco existente somente se ele não tiver ambientes associados.

**Parâmetro:** `id` — identificador do bloco.

**Entrada:** sem corpo.

**Saída — `200 OK`:**

```json
{
  "message": "Bloco deletado com sucesso."
}
```

## Patrimônios

Todas as rotas desta seção exigem autenticação. Neste módulo, “patrimônio” corresponde ao modelo `Item`.

### `GET /patrimonios`

Lista patrimônios com suas unidades e o ambiente de cada unidade.

**Entrada:** sem corpo.

**Saída — `200 OK`:** array de patrimônios com os campos `id`, `tombamento`, `nome`, `descricao`, `valor`, `categoria`, `marca`, `quantidade`, `createdAt` e `unidades`. Cada unidade inclui `ambiente` (objeto ou `null`).

```json
[
  {
    "id": "item-uuid",
    "tombamento": 1001,
    "nome": "Notebook",
    "descricao": null,
    "valor": "3500",
    "categoria": "ELETRÔNICO",
    "marca": "Marca",
    "quantidade": 2,
    "createdAt": "2026-11-10T10:00:00.000Z",
    "unidades": []
  }
]
```

### `GET /patrimonios/:id`

Obtém um patrimônio com as unidades e os ambientes associados.

**Parâmetro:** `id` — identificador do patrimônio.

**Entrada:** sem corpo.

**Saída — `200 OK`:** objeto com o mesmo formato dos itens de `GET /patrimonios`.

### `POST /patrimonios`

Cria um patrimônio.

**Entrada (JSON):**

```json
{
  "tombamento": 1001,
  "nome": "Notebook",
  "descricao": "Notebook para uso administrativo",
  "valor": 3500,
  "categoria": "ELETRÔNICO",
  "marca": "Marca",
  "quantidade": 2
}
```

Obrigatórios: `tombamento` (inteiro não negativo), `nome` (texto não vazio), `valor` (número não negativo), `categoria`, `marca` (texto não vazio) e `quantidade` (inteiro não negativo). `descricao` é opcional e pode ser `null`. Categorias aceitas: `ELETRÔNICO`, `MÓVEIS`, `MATERIAIS`, `CLIMATIZAÇÃO`, `HIGIENIZAÇÃO`, `ESPORTE`.

**Saída — `201 Created`:** o registro criado, com identificador e data gerados pelo banco. Não inclui `unidades`.

### `PUT /patrimonios/:id`

Atualiza parcialmente um patrimônio existente.

**Parâmetro:** `id` — identificador do patrimônio.

**Entrada (JSON):** qualquer subconjunto dos campos aceitos na criação, por exemplo:

```json
{
  "valor": 3200,
  "descricao": "Atualizado"
}
```

Os campos enviados são validados com as mesmas regras da criação. Um corpo vazio é aceito.

**Saída — `200 OK`:**

```json
{
  "message": "Patrimônio atualizado com sucesso."
}
```

### `DELETE /patrimonios/:id`

Exclui um patrimônio somente se não houver unidades cadastradas para ele.

**Parâmetro:** `id` — identificador do patrimônio.

**Entrada:** sem corpo.

**Saída — `200 OK`:**

```json
{
  "message": "Patrimônio deletado com sucesso."
}
```

## Movimentações

Todas as rotas desta seção exigem autenticação. Não há rotas para editar ou excluir movimentações.

### `GET /movimentacoes`

Lista movimentações em ordem decrescente de data (`dataMovimentacao`), incluindo `unidadeItem`, o `item` dessa unidade e o `ambiente` (objeto ou `null`).

**Entrada:** sem corpo.

**Saída — `200 OK`:** array de movimentações. Cada registro contém `id`, `unidadeItemId`, `origem`, `destino`, `resp`, `dataMovimentacao` e `unidadeItem`.

### `GET /movimentacoes/:id`

Obtém uma movimentação e suas relações (`unidadeItem`, `item` e `ambiente`).

**Parâmetro:** `id` — identificador da movimentação.

**Entrada:** sem corpo.

**Saída — `200 OK`:** objeto no formato de um item de `GET /movimentacoes`.

### `POST /movimentacoes`

Registra uma movimentação para uma unidade de patrimônio existente.

**Entrada (JSON):**

```json
{
  "unidadeItemId": "unidade-uuid",
  "origem": "Sala 1",
  "destino": "Sala 2",
  "resp": "Ana Silva"
}
```

Todos os campos são obrigatórios e devem ser textos não vazios. `unidadeItemId` deve corresponder a uma unidade existente. A data (`dataMovimentacao`) é definida automaticamente pelo banco.

**Saída — `201 Created`:** a movimentação criada, incluindo seus dados, `unidadeItem` e as relações `item` e `ambiente`.
