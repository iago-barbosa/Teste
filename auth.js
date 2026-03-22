const STORAGE_USERS = "users";
const STORAGE_LOGGED = "loggedUser";

function getUsers() {
  return JSON.parse(localStorage.getItem(STORAGE_USERS)) || [];
}

function setUsers(users) {
  localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
}

function getLoggedUser() {
  return JSON.parse(localStorage.getItem(STORAGE_LOGGED));
}

function setLoggedUser(user) {
  localStorage.setItem(STORAGE_LOGGED, JSON.stringify(user));
}

function logout() {
  localStorage.removeItem(STORAGE_LOGGED);
  updateAuthSection();
  window.location.href = "index.html";
}

function showError(errorDiv, message) {
  if (!errorDiv) return;
  errorDiv.textContent = message;
  errorDiv.classList.add("show");
}

const STORAGE_TEAMS = "teams";

function getTeams() {
  return JSON.parse(localStorage.getItem(STORAGE_TEAMS)) || [];
}

function setTeams(teams) {
  localStorage.setItem(STORAGE_TEAMS, JSON.stringify(teams));
}

function addTeam(name) {
  const teams = getTeams();
  const id = Date.now();
  teams.push({ id, name });
  setTeams(teams);
  return id;
}

function removeTeam(id) {
  const teams = getTeams().filter((team) => team.id !== id);
  setTeams(teams);
}

function updateAuthSection() {
  const loggedUser = getLoggedUser();
  const authButtons = document.getElementById("authButtons");
  const userSection = document.getElementById("userSection");

  if (!authButtons || !userSection) return;

  if (loggedUser) {
    authButtons.style.display = "none";
    userSection.style.display = "flex";
    const userNameEl = document.getElementById("userName");
    if (userNameEl) {
      userNameEl.textContent = `Olá, ${loggedUser.name}`;
    }
  } else {
    authButtons.style.display = "flex";
    userSection.style.display = "none";
  }
}
