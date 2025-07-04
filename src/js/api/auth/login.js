document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const errorMessages = document.getElementById("errorMessages");
  const successMessages = document.getElementById("successMessages");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = form.email.value.trim();
    const password = form.password.value.trim();

    errorMessages.textContent = "";
    successMessages.textContent = "";

    try {
      const res = await fetch("https://v2.api.noroff.dev/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const json = await res.json();

      if (res.ok) {
        const { accessToken, name } = json.data;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("name", name);

        successMessages.textContent = "Login successful! Redirecting...";


        // Optional: Redirect to previous page or default to listings
        const lastPage = localStorage.getItem("lastPage");
        setTimeout(() => {
          window.location.href = lastPage || "/listings/index.html";
        }, 1000);
      } else {
        errorMessages.textContent = json.errors?.[0]?.message || "Invalid credentials. Please try again.";
      }
    } catch (error) {
      errorMessages.textContent = "Network error. Please try again later.";
      console.error(error);
    }
  });
});
