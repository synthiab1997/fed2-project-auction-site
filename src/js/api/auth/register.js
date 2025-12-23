document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const errorMessages = document.getElementById("errorMessages");
  const successMessages = document.getElementById("successMessages");

  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Reset messages
    errorMessages.textContent = "";
    successMessages.textContent = "";

    const name = form.name.value.trim();
    let email = form.email.value.trim();
    const password = form.password.value.trim();

    // Basic front-end validation
    const errors = [];

    if (!name) {
      errors.push("Username is required.");
    }

    email = email.toLowerCase();
    const emailPattern = /^[\w\-.]+@stud\.noroff\.no$/i;
    if (!emailPattern.test(email)) {
      errors.push("Email must be a valid stud.noroff.no address.");
    }

    if (!password) {
      errors.push("Password is required.");
    } else if (password.length < 8) {
      errors.push("Password must be at least 8 characters long.");
    }

    if (errors.length > 0) {
      errorMessages.innerHTML = errors
        .map((msg) => `<p class="text-red-600">${msg}</p>`)
        .join("");
      return;
    }

    // If validation passes → call API
    try {
      const res = await fetch("https://v2.api.noroff.dev/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const json = await res.json();

      if (res.ok) {
        successMessages.innerHTML =
          '<p class="text-green-600">Registration successful! Redirecting to login…</p>';

        // Optional small delay so user can see the message
        setTimeout(() => {
          window.location.href = "/auth/login/index.html";
        }, 1500);
      } else {
        const message =
          json?.errors?.[0]?.message || "Registration failed. Please try again.";
        errorMessages.innerHTML = `<p class="text-red-600">${message}</p>`;
      }
    } catch (err) {
      console.error(err);
      errorMessages.innerHTML =
        '<p class="text-red-600">Network error. Please check your connection and try again.</p>';
    }
  });
});
