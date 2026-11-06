# Controle Patrimonial - Backend

### Arquitetura do servidor

Arquitetura escolhida foi uma arquitetura por camadas e organizada em módulos.
Cada módulo terá como principais camadas:

- **Handlers**: Responsável pelas requisições e respostas ao usuário.
- **Services**: Onde a lógica, regras de negócio e validações do servidor serão feitas.
- **Repositor**: Onde ficará os métodos responsáveis pela conexão com o banco de dados.
- **DTOs**: Estruturas responsáveis pelo tráfego dos dados necessários de um objeto.
- **Validations** (Opcional): Validações de dados sensíveis e importantes.


`
    Módulos principais: { Users, Ambientes, Patrimonio/Itens, movimentacao, bloco }
`