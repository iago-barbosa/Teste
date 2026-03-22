// Exemplo: Como usar auth.utils.js em diferentes contextos

// ============================================
// 1. NO NAVEGADOR (em arquivos HTML)
// ============================================

// Adicionar no HTML:
// <script src="auth.utils.js"></script>

// Depois usar as funções:
/*
const email = "user@example.com";
const password = "123456";

// Validar login
const validation = validateLogin(email, password);
if (!validation.valid) {
  console.error(validation.error);
  return;
}

// Obter de localStorage
const users = getUsersFromStorage(localStorage);
const user = findUser(email, password, users);
*/

// ============================================
// 2. EM NODE.JS (para testes e serverless)
// ============================================

// Importar:
const auth = require("./auth.utils.js");

// Usar:
const { isValidEmail, validateSignup, createUser } = auth;

// Exemplo de função de registro para API
async function registerUser(req, res) {
  const { name, email, password, passwordConfirm } = req.body;

  // Validar
  const validation = auth.validateSignup(
    name,
    email,
    password,
    passwordConfirm,
  );
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  // Verificar email duplicado (simular com mock storage)
  const mockStorage = {
    getItem: () => JSON.stringify([]), // Simulação
  };
  const users = auth.getUsersFromStorage(mockStorage);

  if (auth.emailExists(email, users)) {
    return res.status(400).json({ error: "Email já registrado" });
  }

  // Criar usuário
  const newUser = auth.createUser(name, email, password);

  res.status(201).json({
    message: "Usuário criado com sucesso",
    user: { name: newUser.name, email: newUser.email },
  });
}

// Exemplo de função de login para API
async function loginUser(req, res) {
  const { email, password } = req.body;

  // Validar
  const validation = auth.validateLogin(email, password);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  // Buscar usuário (simular)
  const mockStorage = {
    getItem: () =>
      JSON.stringify([
        { email: "user@example.com", name: "João", password: "123456" },
      ]),
  };
  const users = auth.getUsersFromStorage(mockStorage);
  const user = auth.findUser(email, password, users);

  if (!user) {
    return res.status(401).json({ error: "Email ou senha inválidos" });
  }

  res.status(200).json({
    message: "Login realizado com sucesso",
    user: { name: user.name, email: user.email },
  });
}

// ============================================
// 3. EXEMPLO DE TESTE MAIS COMPLEXO
// ============================================

describe("User Registration Flow", () => {
  test("fluxo completo de registro com validações", () => {
    // Simular banco de dados
    let users = [];

    const signupData = {
      name: "João Silva",
      email: "joao@example.com",
      password: "123456",
      passwordConfirm: "123456",
    };

    // Step 1: Validar
    const validation = auth.validateSignup(
      signupData.name,
      signupData.email,
      signupData.password,
      signupData.passwordConfirm,
    );
    expect(validation.valid).toBe(true);

    // Step 2: Verificar email
    expect(auth.emailExists(signupData.email, users)).toBe(false);

    // Step 3: Criar usuário
    const newUser = auth.createUser(
      signupData.name,
      signupData.email,
      signupData.password,
    );

    // Step 4: Adicionar ao banco
    users.push(newUser);
    expect(users).toHaveLength(1);

    // Step 5: Verificar que email agora existe
    expect(auth.emailExists(signupData.email, users)).toBe(true);

    // Step 6: Login com novo usuário
    const found = auth.findUser(signupData.email, signupData.password, users);
    expect(found).not.toBeNull();
    expect(found.email).toBe(signupData.email);
  });
});

// ============================================
// 4. CASOS DE USO COM MOCK DE STORAGE
// ============================================

function demonstrarMockStorage() {
  // Mock localStorage
  const mockStorage = {
    data: {},
    getItem(key) {
      return this.data[key] || null;
    },
    setItem(key, value) {
      this.data[key] = value;
    },
    removeItem(key) {
      delete this.data[key];
    },
  };

  // Simular salvamento de times
  const teams = [
    auth.createTeam("Time A", 1),
    auth.createTeam("Time B", 2),
    auth.createTeam("Time C", 3),
  ];

  mockStorage.setItem("teams", JSON.stringify(teams));

  // Recuperar
  const savedTeams = auth.getTeamsFromStorage(mockStorage);
  console.log("Times salvos:", savedTeams);
  // Output: [ { id: 1, name: 'Time A' }, { id: 2, name: 'Time B' }, { id: 3, name: 'Team C' } ]

  // Remover um time
  const updated = auth.removeTeamById(2, savedTeams);
  console.log("Após remover Time B:", updated);
  // Output: [ { id: 1, name: 'Time A' }, { id: 3, name: 'Team C' } ]
}

// ============================================
// 5. VALIDAÇÃO DE MÚLTIPLOS EMAILS
// ============================================

function validarMultiplosEmails(emails) {
  return emails.map((email) => ({
    email,
    valido: auth.isValidEmail(email),
  }));
}

const resultado = validarMultiplosEmails([
  "user@example.com", // ✓ válido
  "invalid.email", // ✗ inválido
  "test@domain.co.uk", // ✓ válido
  "space @example.com", // ✗ inválido
  "user+tag@example.com", // ✓ válido
]);

console.log(resultado);
/*
Output:
[
  { email: 'user@example.com', valido: true },
  { email: 'invalid.email', valido: false },
  { email: 'test@domain.co.uk', valido: true },
  { email: 'space @example.com', valido: false },
  { email: 'user+tag@example.com', valido: true }
]
*/

// Exportar para uso em outros módulos
module.exports = {
  registerUser,
  loginUser,
  demonstrarMockStorage,
  validarMultiplosEmails,
};
