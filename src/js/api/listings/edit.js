import { API_BASE, API_KEY } from "../constants.js";

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("accessToken");
  const username = localStorage.getItem("name");

  const errorEl = document.getElementById("edit-error");
  const successEl = document.getElementById("edit-success");
  const form = document.getElementById("edit-form");

  if (!token || !username) {
    window.location.href = "/auth/login/index.html";
    return;
  }

  const id = new URLSearchParams(window.location.search).get("id");
  if (!id) {
    errorEl.textContent = "Missing listing id.";
    return;
  }

  // 1) Load listing + check seller
  try {
    const res = await fetch(`${API_BASE}/auction/listings/${id}?_seller=true`, {
      headers: { "X-Noroff-API-Key": API_KEY },
    });
    const json = await res.json();

    if (!res.ok) {
      errorEl.textContent = json?.errors?.[0]?.message || "Could not load listing.";
      return;
    }

    const listing = json.data;

    // seller safety check
    if (listing?.seller?.name && listing.seller.name !== username) {
      errorEl.textContent = "You can only edit your own listings.";
      form?.classList.add("hidden");
      return;
    }

    document.getElementById("title").value = listing.title || "";
    document.getElementById("description").value = listing.description || "";
    document.getElementById("media").value = listing.media?.[0]?.url || "";
  } catch (e) {
    console.error(e);
    errorEl.textContent = "Network error while loading listing.";
    return;
  }

  // 2) Submit update
  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (errorEl) errorEl.textContent = "";
    if (successEl) successEl.textContent = "";

    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const mediaUrl = document.getElementById("media").value.trim();

    if (!title || !description || !mediaUrl) {
      errorEl.textContent = "All fields are required.";
      return;
    }

    const payload = {
      title,
      description,
      media: [{ url: mediaUrl, alt: title }],
    };

    try {
      const res = await fetch(`${API_BASE}/auction/listings/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Noroff-API-Key": API_KEY,
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        errorEl.textContent = json?.errors?.[0]?.message || "Update failed.";
        return;
      }

      successEl.textContent = "Listing updated successfully!";
      setTimeout(() => {
        window.location.href = `/listings/single/index.html?id=${encodeURIComponent(id)}`;
      }, 900);
    } catch (err) {
      console.error(err);
      errorEl.textContent = "Network error. Please try again.";
    }
  });
});
