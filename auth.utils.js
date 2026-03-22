// Funções de utility para autenticação e times - sem dependência de DOM
// Podem ser testadas com Jest

const STORAGE_USERS = "users";
const STORAGE_LOGGED = "loggedUser";
const STORAGE_TEAMS = "teams";

/**
 * Valida formato de email
 * @param {string} email - Email a validar
 * @returns {boolean} Email é válido
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida força de senha
 * @param {string} password - Senha a validar
 * @returns {boolean} Senha atende critérios mínimos
 */
function isValidPassword(password) {
  return Boolean(password && password.length >= 6);
}

/**
 * Valida dados de registro
 * @param {string} name - Nome completo
 * @param {string} email - Email
 * @param {string} password - Senha
 * @param {string} passwordConfirm - Confirmação de senha
 * @returns {object} { valid: boolean, error?: string }
 */
function validateSignup(name, email, password, passwordConfirm) {
  if (!name || !email || !password || !passwordConfirm) {
    return { valid: false, error: "Todos os campos são obrigatórios" };
  }

  if (!isValidEmail(email)) {
    return { valid: false, error: "Formato de email inválido" };
  }

  if (password !== passwordConfirm) {
    return { valid: false, error: "As senhas não coincidem" };
  }

  if (!isValidPassword(password)) {
    return { valid: false, error: "A senha deve ter pelo menos 6 caracteres" };
  }

  return { valid: true };
}

/**
 * Valida dados de login
 * @param {string} email - Email
 * @param {string} password - Senha
 * @returns {object} { valid: boolean, error?: string }
 */
function validateLogin(email, password) {
  if (!email || !password) {
    return { valid: false, error: "Email e senha são obrigatórios" };
  }

  if (!isValidEmail(email)) {
    return { valid: false, error: "Formato de email inválido" };
  }

  return { valid: true };
}

/**
 * Verifica se email já existe na lista de usuários
 * @param {string} email - Email a verificar
 * @param {Array} users - Lista de usuários
 * @returns {boolean} Email existe
 */
function emailExists(email, users) {
  return users.some((u) => u.email === email);
}

/**
 * Encontra usuário por email e senha
 * @param {string} email - Email do usuário
 * @param {string} password - Senha do usuário
 * @param {Array} users - Lista de usuários
 * @returns {object|null} Usuário encontrado ou null
 */
function findUser(email, password, users) {
  return (
    users.find((u) => u.email === email && u.password === password) || null
  );
}

/**
 * Cria novo usuário
 * @param {string} name - Nome completo
 * @param {string} email - Email
 * @param {string} password - Senha
 * @returns {object} Novo usuário
 */
function createUser(name, email, password) {
  return { name, email, password };
}

/**
 * Cria novo time
 * @param {string} name - Nome do time
 * @param {number} id - ID opcional (para testes)
 * @returns {object} Novo time com id
 */
function createTeam(name, id) {
  return { id: id || Date.now() + Math.random(), name };
}

/**
 * Remove time por ID
 * @param {number} id - ID do time
 * @param {Array} teams - Lista de times
 * @returns {Array} Lista de times sem o removido
 */
function removeTeamById(id, teams) {
  return teams.filter((team) => team.id !== id);
}

/**
 * Obtém lista de times
 * @param {object} storage - Objeto de storage (localStorage etc)
 * @returns {Array} Lista de times
 */
function getTeamsFromStorage(storage) {
  try {
    return JSON.parse(storage.getItem(STORAGE_TEAMS)) || [];
  } catch {
    return [];
  }
}

/**
 * Obtém lista de usuários
 * @param {object} storage - Objeto de storage
 * @returns {Array} Lista de usuários
 */
function getUsersFromStorage(storage) {
  try {
    return JSON.parse(storage.getItem(STORAGE_USERS)) || [];
  } catch {
    return [];
  }
}

/**
 * Obtém usuário logado
 * @param {object} storage - Objeto de storage
 * @returns {object|null} Usuário logado ou null
 */
function getLoggedUserFromStorage(storage) {
  try {
    return JSON.parse(storage.getItem(STORAGE_LOGGED));
  } catch {
    return null;
  }
}

module.exports = {
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
  STORAGE_USERS,
  STORAGE_LOGGED,
  STORAGE_TEAMS,
};
