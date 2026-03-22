# Testes Unitários com Jest

## Configuração

O projeto foi configurado para usar **Jest** como framework de testes unitários. A estrutura separou a lógica de negócio da lógica de interface (DOM), permitindo testes robustos e confiáveis.

## Estrutura do Projeto

```
Teste/
├── auth.js                 # Funções com dependência de DOM (para uso nos HTMLs)
├── auth.utils.js          # Funções puras de lógica (testáveis com Jest)
├── __tests__/
│   ├── auth.utils.test.js # Testes unitários das funções lógicas
│   └── integration.test.js # Testes de integração de fluxos completos
├── package.json           # Dependências e scripts
├── jest.config.js         # Configuração do Jest
└── [outros arquivos HTML/CSS]
```

## Instalação

1. Instale as dependências:

```bash
npm install
```

## Rodando os Testes

### Executar todos os testes uma vez

```bash
npm test
```

### Executar testes em modo observe (watch)

```bash
npm run test:watch
```

### Gerar relatório de cobertura de código

```bash
npm run test:coverage
```

## Arquivos de Teste

### `__tests__/auth.utils.test.js`

Testes unitários para as funções de validação e gerenciamento de dados:

- **Email Validation** - Testa validação de diversos formatos de email
- **Password Validation** - Testa critérios de força de senha
- **validateSignup** - Testa validação completa de registro
- **validateLogin** - Testa validação de login
- **User Management** - Testa funções de usuário (criar, encontrar, verificar existência)
- **Team Management** - Testa funções de times (criar, remover)
- **Storage Functions** - Testa leitura de dados do localStorage com mocks

### `__tests__/integration.test.js`

Testes de integração que validam fluxos completos:

- **Complete Signup Flow** - Simula fluxo completo de registro
- **Complete Login Flow** - Simula fluxo completo de login
- **Team Management Flow** - Simula operações com times
- **Storage with Mock Data** - Testa integração com storage

## Cobertura de Testes

Os testes cobrem:

- ✅ Validação de email com vários formatos
- ✅ Validação de senha e força mínima
- ✅ Validação de formulários de signup e login
- ✅ Gerenciamento de usuários
- ✅ Gerenciamento de times
- ✅ Leitura/escrita em armazenamento
- ✅ Tratamento de erros e JSON inválido
- ✅ Fluxos completos de autenticação

## Exemplo de Execução

```bash
$ npm test

 PASS  __tests__/auth.utils.test.js
 PASS  __tests__/integration.test.js

Test Suites: 2 passed, 2 total
Tests:       45 passed, 45 total
Snapshots:   0 total
Time:        2.345s
```

## Arquitetura de Testes

### auth.utils.js

Contém funções **puras** e **testáveis**:

- Sem dependências de DOM
- Sem side effects (não afetam estado global)
- Usa mocks para localStorage
- Fácil de testar e depurar

### auth.js

Mantém a integração com DOM:

- Usa funções de `auth.utils.js` para lógica
- Manipula elementos HTML
- Gerencia eventos de UI

## Para Adicionar Novos Testes

1. Crie um novo arquivo em `__tests__/`
2. Importe as funções de `auth.utils.js`
3. Use a sintaxe padrão do Jest:

```javascript
describe("Nova Feature", () => {
  test("deve fazer algo", () => {
    const result = myFunction(input);
    expect(result).toBe(expectedValue);
  });
});
```

## Recursos Utilizados

- **Jest 29.7.0** - Framework de testes
- **jsdom** - Simulação de ambiente DOM para testes

## Troubleshooting

### Erro "Cannot find module"

Certifique-se de que está no diretório correto e que `node_modules/` foi instalado com `npm install`.

### Testes não executam

Verifique se:

- Os arquivos de teste terminam com `.test.js`
- Estão na pasta `__tests__/`
- A sintaxe está correta

### Mocks de localStorage

Os testes usam `jest.fn()` para simular localStorage sem necessidade de ambiente real.
