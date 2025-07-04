document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("listing-form");
  const cancelBtn = document.getElementById("cancel-btn");

  const token = localStorage.getItem("accessToken");

  if (!token) {
    window.location.href = "/auth/login/index.html";
    return;
  }

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const mediaInputs = document.getElementById("media").value.trim(); // expected to be URL
    const endsAtRaw = document.getElementById("deadline").value;

    if (!title || !endsAtRaw || !mediaInputs) {
      alert("Please fill in all required fields.");
      return;
    }

    const endsAt = new Date(endsAtRaw).toISOString();
    const media = [{ url: mediaInputs, alt: title }];

    const payload = {
      title,
      description,
      endsAt,
      media,
    };

    try {
      const res = await fetch("https://v2.api.noroff.dev/auction/listings", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (res.ok) {
        alert("Listing created successfully!");
        form.reset();
        window.location.href = "/listings/index.html";
      } else {
        alert(json.errors?.[0]?.message || "Failed to create listing.");
      }
    } catch (err) {
      console.error("Error creating listing:", err);
      alert("Network error. Please try again later.");
    }
  });

  // Cancel button
  cancelBtn?.addEventListener("click", () => {
    form.reset();
    window.location.href = "/listings/index.html";
  });
});
