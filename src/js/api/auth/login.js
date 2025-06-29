document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const errorMessages = document.getElementById("errorMessages");
  const successMessages = document.getElementById("successMessages");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = form.email.value.trim();
    const password = form.password.value.trim();

    try {
      const res = await fetch("https://v2.api.noroff.dev/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("accessToken", data.data.accessToken);
        localStorage.setItem("name", data.data.name);
        successMessages.textContent = "Login successful! Redirecting...";
        setTimeout(() => (window.location.href = "/"), 1000);
      } else {
        errorMessages.textContent = data.errors?.[0]?.message || "Login failed.";
      }
    } catch {
      errorMessages.textContent = "Network error.";
    }
  });
});
