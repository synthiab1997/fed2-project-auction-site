document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registerForm");
    const errorMessages = document.getElementById("errorMessages");
    const successMessages = document.getElementById("successMessages");
  
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
  
      errorMessages.textContent = "";
      successMessages.textContent = "";
  
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const password = form.password.value.trim();
  
      if (!email.endsWith("@stud.noroff.no")) {
        errorMessages.textContent = "Email must be a stud.noroff.no address.";
        return;
      }
  
      try {
        const res = await fetch("https://v2.api.noroff.dev/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password })
        });
  
        const json = await res.json();
  
        if (res.ok) {
          successMessages.textContent = "Registration successful!";
          setTimeout(() => (window.location.href = "/auth/login/index.html"), 1500);
        } else {
          errorMessages.textContent = json.errors?.[0]?.message || "Registration failed.";
        }
      } catch (err) {
        errorMessages.textContent = "Network error.";
      }
    });
  });
  