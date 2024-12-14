document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.getElementById("logout-btn");

  if (logoutButton) {
    logoutButton.addEventListener("click", (event) => {
      event.preventDefault();

      // Clear localStorage or session data
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("username");
      localStorage.removeItem("credits");

      // Redirect to the homepage
      window.location.href = "/";
    });
  }
});
