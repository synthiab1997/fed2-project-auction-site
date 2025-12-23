
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("accessToken");

  const logoutBtn = document.getElementById("logout-btn");
  const loginLink = document.getElementById("login-link");
  const registerLink = document.getElementById("register-link");
  const profileLink = document.getElementById("profile-link");
  const createLink = document.getElementById("create-listing-link");

  
  // Auth state (UI visibility)//
  
  if (token) {
    logoutBtn?.classList.remove("hidden");
    profileLink?.classList.remove("hidden");
    createLink?.classList.remove("hidden");

    loginLink?.classList.add("hidden");
    registerLink?.classList.add("hidden");
  } else {
    logoutBtn?.classList.add("hidden");
    profileLink?.classList.add("hidden");
    createLink?.classList.add("hidden");

    loginLink?.classList.remove("hidden");
    registerLink?.classList.remove("hidden");
  }

  // Logout//
  logoutBtn?.addEventListener("click", (event) => {
    event.preventDefault();

    localStorage.removeItem("accessToken");
    localStorage.removeItem("name");
    localStorage.removeItem("lastPage");

    // ✅ Redirect to homepage
    window.location.href = "/";
  });
});
