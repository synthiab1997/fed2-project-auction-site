
import { API_BASE, API_KEY } from "../constants.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("listing-form");
  const cancelBtn = document.getElementById("cancel-btn");
  const errorEl = document.getElementById("create-error");
  const successEl = document.getElementById("create-success");

  const token = localStorage.getItem("accessToken");

  // Must be logged in
  if (!token) {
    window.location.href = "/auth/login/index.html";
    return;
  }

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
  
    if (errorEl) errorEl.textContent = "";
    if (successEl) successEl.textContent = "";  

    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const mediaUrl = document.getElementById("media").value.trim();
    const deadlineRaw = document.getElementById("deadline").value;

    if (!title || !description || !mediaUrl || !deadlineRaw) {
      errorEl.textContent = "Please fill in all required fields.";
      return;
    }

    // Deadline → ISO string
    const endsAt = new Date(deadlineRaw).toISOString();

    const media = [
      {
        url: mediaUrl,
        alt: title,
      },
    ];

    const payload = {
      title,
      description,
      media,
      endsAt,
    };

    try {
      const res = await fetch(`${API_BASE}/auction/listings`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Noroff-API-Key": API_KEY,
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        console.error("Create listing error:", json);
        errorEl.textContent =
          json?.errors?.[0]?.message || "Failed to create listing.";
        return;
      }

      successEl.textContent = "Listing created successfully!";
      form.reset();

      setTimeout(() => {
        window.location.href = "/listings/index.html";
      }, 1000);
    } catch (err) {
      console.error("Error creating listing:", err);
      errorEl.textContent = "Network error. Please try again later.";
    }
  });

  cancelBtn?.addEventListener("click", () => {
    form.reset();
    window.location.href = "/listings/index.html";
  });
});
