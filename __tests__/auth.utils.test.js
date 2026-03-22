const {
  isValidEmail,
  isValidPassword,
  validateSignup,
  validateLogin,
  emailExists,
  findUser,
  createUser,
  createTeam,
  removeTeamById,
  getTeamsFromStorage,
  getUsersFromStorage,
  getLoggedUserFromStorage,
} = require("../auth.utils.js");

describe("Email Validation", () => {
  test("deve aceitar email válido", () => {
    expect(isValidEmail("user@example.com")).toBe(true);
  });

  test("deve rejeitar email sem @", () => {
    expect(isValidEmail("userexample.com")).toBe(false);
  });

  test("deve rejeitar email sem domínio", () => {
    expect(isValidEmail("user@")).toBe(false);
  });

  test("deve rejeitar email sem ponto", () => {
    expect(isValidEmail("user@com")).toBe(false);
  });

  test("deve rejeitar email vazio", () => {
    expect(isValidEmail("")).toBe(false);
  });

  test("deve rejeitar email com espaço", () => {
    expect(isValidEmail("user @example.com")).toBe(false);
  });
});

describe("Password Validation", () => {
  test("deve aceitar senha com 6 caracteres", () => {
    expect(isValidPassword("123456")).toBe(true);
  });

  test("deve aceitar senha com mais de 6 caracteres", () => {
    expect(isValidPassword("senhaLonga123")).toBe(true);
  });

  test("deve rejeitar senha com menos de 6 caracteres", () => {
    expect(isValidPassword("12345")).toBe(false);
  });

  test("deve rejeitar senha vazia", () => {
    expect(isValidPassword("")).toBe(false);
  });

  test("deve rejeitar senha null", () => {
    expect(isValidPassword(null)).toBe(false);
  });

  test("deve rejeitar senha undefined", () => {
    expect(isValidPassword(undefined)).toBe(false);
  });
});

describe("validateSignup", () => {
  test("deve validar signup com dados válidos", () => {
    const result = validateSignup(
      "João Silva",
      "joao@example.com",
      "123456",
      "123456",
    );
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  test("deve rejeitar signup sem campos preenchidos", () => {
    const result = validateSignup("", "joao@example.com", "123456", "123456");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Todos os campos são obrigatórios");
  });

  test("deve rejeitar email inválido", () => {
    const result = validateSignup(
      "João Silva",
      "joao@invalid",
      "123456",
      "123456",
    );
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Formato de email inválido");
  });

  test("deve rejeitar senhas diferentes", () => {
    const result = validateSignup(
      "João Silva",
      "joao@example.com",
      "123456",
      "654321",
    );
    expect(result.valid).toBe(false);
    expect(result.error).toBe("As senhas não coincidem");
  });

  test("deve rejeitar senha curta", () => {
    const result = validateSignup(
      "João Silva",
      "joao@example.com",
      "12345",
      "12345",
    );
    expect(result.valid).toBe(false);
    expect(result.error).toBe("A senha deve ter pelo menos 6 caracteres");
  });

  test("deve rejeitar campo nome vazio", () => {
    const result = validateSignup("", "joao@example.com", "123456", "123456");
    expect(result.valid).toBe(false);
  });
});

describe("validateLogin", () => {
  test("deve validar login com dados válidos", () => {
    const result = validateLogin("joao@example.com", "123456");
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  test("deve rejeitar login sem email", () => {
    const result = validateLogin("", "123456");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Email e senha são obrigatórios");
  });

  test("deve rejeitar login sem senha", () => {
    const result = validateLogin("joao@example.com", "");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Email e senha são obrigatórios");
  });

  test("deve rejeitar email inválido", () => {
    const result = validateLogin("joao@invalid", "123456");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Formato de email inválido");
  });
});

describe("User Management", () => {
  test("deve verificar se email existe", () => {
    const users = [
      { email: "joao@example.com", name: "João", password: "123456" },
    ];
    expect(emailExists("joao@example.com", users)).toBe(true);
    expect(emailExists("maria@example.com", users)).toBe(false);
  });

  test("deve encontrar usuário por email e senha", () => {
    const users = [
      { email: "joao@example.com", name: "João", password: "123456" },
      { email: "maria@example.com", name: "Maria", password: "654321" },
    ];
    const user = findUser("joao@example.com", "123456", users);
    expect(user).toEqual({
      email: "joao@example.com",
      name: "João",
      password: "123456",
    });
  });

  test("deve retornar null quando usuário não encontrado", () => {
    const users = [
      { email: "joao@example.com", name: "João", password: "123456" },
    ];
    const user = findUser("maria@example.com", "123456", users);
    expect(user).toBeNull();
  });

  test("deve retornar null com senha incorreta", () => {
    const users = [
      { email: "joao@example.com", name: "João", password: "123456" },
    ];
    const user = findUser("joao@example.com", "wrongpass", users);
    expect(user).toBeNull();
  });

  test("deve criar novo usuário", () => {
    const user = createUser("João Silva", "joao@example.com", "123456");
    expect(user).toEqual({
      name: "João Silva",
      email: "joao@example.com",
      password: "123456",
    });
  });
});

describe("Team Management", () => {
  test("deve criar novo time com ID único", () => {
    const team1 = createTeam("Time A", 1);
    const team2 = createTeam("Time B", 2);

    expect(team1.name).toBe("Time A");
    expect(team2.name).toBe("Time B");
    expect(team1.id).not.toBe(team2.id);
    expect(typeof team1.id).toMatch(/number|string/);
  });

  test("deve remover time por ID", () => {
    const teams = [
      { id: 1, name: "Time A" },
      { id: 2, name: "Time B" },
      { id: 3, name: "Time C" },
    ];
    const result = removeTeamById(2, teams);
    expect(result).toHaveLength(2);
    expect(result.some((t) => t.id === 2)).toBe(false);
    expect(result.some((t) => t.id === 1)).toBe(true);
  });

  test("deve retornar lista vazia se teamId não existe", () => {
    const teams = [
      { id: 1, name: "Time A" },
      { id: 2, name: "Time B" },
    ];
    const result = removeTeamById(999, teams);
    expect(result).toEqual(teams);
  });
});

describe("Storage Functions", () => {
  test("deve obter times do storage", () => {
    const mockStorage = {
      getItem: jest.fn(() =>
        JSON.stringify([
          { id: 1, name: "Time A" },
          { id: 2, name: "Time B" },
        ]),
      ),
    };
    const teams = getTeamsFromStorage(mockStorage);
    expect(teams).toHaveLength(2);
    expect(teams[0].name).toBe("Time A");
  });

  test("deve retornar array vazio se storage está vazio", () => {
    const mockStorage = {
      getItem: jest.fn(() => null),
    };
    const teams = getTeamsFromStorage(mockStorage);
    expect(teams).toEqual([]);
  });

  test("deve obter usuários do storage", () => {
    const mockStorage = {
      getItem: jest.fn(() =>
        JSON.stringify([
          { email: "joao@example.com", name: "João", password: "123456" },
        ]),
      ),
    };
    const users = getUsersFromStorage(mockStorage);
    expect(users).toHaveLength(1);
    expect(users[0].email).toBe("joao@example.com");
  });

  test("deve obter usuário logado do storage", () => {
    const mockStorage = {
      getItem: jest.fn(() =>
        JSON.stringify({ name: "João", email: "joao@example.com" }),
      ),
    };
    const user = getLoggedUserFromStorage(mockStorage);
    expect(user.name).toBe("João");
    expect(user.email).toBe("joao@example.com");
  });

  test("deve retornar null se nenhum usuário logado", () => {
    const mockStorage = {
      getItem: jest.fn(() => null),
    };
    const user = getLoggedUserFromStorage(mockStorage);
    expect(user).toBeNull();
  });

  test("deve tratar JSON inválido no storage", () => {
    const mockStorage = {
      getItem: jest.fn(() => "invalid json"),
    };
    const teams = getTeamsFromStorage(mockStorage);
    expect(teams).toEqual([]);
  });
});
