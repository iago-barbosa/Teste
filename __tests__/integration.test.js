const auth = require("../auth.utils.js");

describe("Integration Tests", () => {
  describe("Complete Signup Flow", () => {
    test("deve completar fluxo de registra válido", () => {
      // Step 1: Validar dados de entrada
      const signupData = {
        name: "João Silva",
        email: "joao@example.com",
        password: "123456",
        passwordConfirm: "123456",
      };

      const validation = auth.validateSignup(
        signupData.name,
        signupData.email,
        signupData.password,
        signupData.passwordConfirm,
      );

      expect(validation.valid).toBe(true);

      // Step 2: Verificar se email já existe
      const existingUsers = [];
      const emailAlreadyExists = auth.emailExists(
        signupData.email,
        existingUsers,
      );
      expect(emailAlreadyExists).toBe(false);

      // Step 3: Criar novo usuário
      const newUser = auth.createUser(
        signupData.name,
        signupData.email,
        signupData.password,
      );

      expect(newUser.name).toBe("João Silva");
      expect(newUser.email).toBe("joao@example.com");
    });

    test("deve rejeitar signup com email duplicado", () => {
      const signupData = {
        name: "João Silva",
        email: "joao@example.com",
        password: "123456",
        passwordConfirm: "123456",
      };

      const validation = auth.validateSignup(
        signupData.name,
        signupData.email,
        signupData.password,
        signupData.passwordConfirm,
      );

      expect(validation.valid).toBe(true);

      const existingUsers = [
        { email: "joao@example.com", name: "João Antigo", password: "oldpass" },
      ];

      const emailAlreadyExists = auth.emailExists(
        signupData.email,
        existingUsers,
      );
      expect(emailAlreadyExists).toBe(true);
    });
  });

  describe("Complete Login Flow", () => {
    test("deve completar fluxo de login válido", () => {
      const loginData = {
        email: "joao@example.com",
        password: "123456",
      };

      // Step 1: Validar dados de entrada
      const validation = auth.validateLogin(
        loginData.email,
        loginData.password,
      );
      expect(validation.valid).toBe(true);

      // Step 2: Encontrar usuário
      const users = [
        { email: "joao@example.com", name: "João", password: "123456" },
      ];

      const user = auth.findUser(loginData.email, loginData.password, users);
      expect(user).not.toBeNull();
      expect(user.name).toBe("João");
    });

    test("deve rejeitar login com credenciais inválidas", () => {
      const loginData = {
        email: "joao@example.com",
        password: "wrongpass",
      };

      const validation = auth.validateLogin(
        loginData.email,
        loginData.password,
      );
      expect(validation.valid).toBe(true);

      const users = [
        { email: "joao@example.com", name: "João", password: "123456" },
      ];

      const user = auth.findUser(loginData.email, loginData.password, users);
      expect(user).toBeNull();
    });

    test("deve rejeitar login com email não registrado", () => {
      const loginData = {
        email: "naoexiste@example.com",
        password: "123456",
      };

      const validation = auth.validateLogin(
        loginData.email,
        loginData.password,
      );
      expect(validation.valid).toBe(true);

      const users = [
        { email: "joao@example.com", name: "João", password: "123456" },
      ];

      const user = auth.findUser(loginData.email, loginData.password, users);
      expect(user).toBeNull();
    });
  });

  describe("Team Management Flow", () => {
    test("deve criar múltiplos times", () => {
      const teams = [];

      // Criar 3 times com IDs explícitos
      teams.push(auth.createTeam("Time A", 1));
      teams.push(auth.createTeam("Time B", 2));
      teams.push(auth.createTeam("Time C", 3));

      expect(teams).toHaveLength(3);
      expect(teams[0].name).toBe("Time A");
      expect(teams[1].name).toBe("Time B");
      expect(teams[2].name).toBe("Time C");

      // Todos devem ter IDs únicos
      const ids = new Set(teams.map((t) => t.id));
      expect(ids.size).toBe(3);
    });

    test("deve adicionar e remover times corretamente", () => {
      let teams = [];

      // Criar times com IDs explícitos
      const team1 = auth.createTeam("Time A", 1);
      const team2 = auth.createTeam("Time B", 2);
      const team3 = auth.createTeam("Time C", 3);

      teams.push(team1, team2, team3);
      expect(teams).toHaveLength(3);

      // Remover time do meio
      teams = auth.removeTeamById(team2.id, teams);
      expect(teams).toHaveLength(2);
      expect(teams[0].name).toBe("Time A");
      expect(teams[1].name).toBe("Time C");

      // Remover primeiro
      teams = auth.removeTeamById(team1.id, teams);
      expect(teams).toHaveLength(1);
      expect(teams[0].name).toBe("Time C");

      // Remover último
      teams = auth.removeTeamById(team3.id, teams);
      expect(teams).toHaveLength(0);
    });
  });

  describe("Storage with Mock Data", () => {
    test("deve carregar dados completos do storage", () => {
      const mockStorage = {
        getItem: jest.fn((key) => {
          const data = {
            users: JSON.stringify([
              { email: "joao@example.com", name: "João", password: "123456" },
              { email: "maria@example.com", name: "Maria", password: "654321" },
            ]),
            teams: JSON.stringify([
              { id: 1, name: "Time A" },
              { id: 2, name: "Time B" },
            ]),
            loggedUser: JSON.stringify({
              email: "joao@example.com",
              name: "João",
            }),
          };
          return data[key] || null;
        }),
      };

      const users = auth.getUsersFromStorage(mockStorage);
      const teams = auth.getTeamsFromStorage(mockStorage);
      const loggedUser = auth.getLoggedUserFromStorage(mockStorage);

      expect(users).toHaveLength(2);
      expect(teams).toHaveLength(2);
      expect(loggedUser.name).toBe("João");
    });

    test("deve recuperar após erro de JSON", () => {
      const mockStorage = {
        getItem: jest.fn(() => "invalid json"),
      };

      const teams = auth.getTeamsFromStorage(mockStorage);
      const users = auth.getUsersFromStorage(mockStorage);

      expect(teams).toEqual([]);
      expect(users).toEqual([]);
    });
  });
});
