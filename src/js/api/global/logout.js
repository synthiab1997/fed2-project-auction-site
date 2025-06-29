document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.getElementById("logout-btn");

  if (logoutButton) {
    logoutButton.addEventListener("click", (event) => {
      event.preventDefault();

      // Clear all session data
      localStorage.clear();

      // Redirect to login or home
      window.location.href = "/auth/login/index.html";
    });
  }
});
