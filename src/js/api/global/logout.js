document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("accessToken");
  const logoutBtn = document.getElementById("logout-btn");
  const loginLink = document.getElementById("login-link");
  const registerLink = document.getElementById("register-link");
  const profileLink = document.getElementById("profile-link");


  if (logoutBtn) {
    logoutBtn.addEventListener("click", (event) => {
      event.preventDefault();
      localStorage.clear();
      window.location.href = "/auth/login/index.html";
    });
  }

  if (token) {
    logoutBtn?.classList.remove("hidden");
    profileLink?.classList.remove("hidden");ß
    loginLink?.classList.add("hidden");
    registerLink?.classList.add("hidden");
  } else {
    logoutBtn?.classList.add("hidden");
    profileLink?.classList.add("hidden");
    loginLink?.classList.remove("hidden");
    registerLink?.classList.remove("hidden");
  }
});
