import { API_BASE, API_KEY } from "../constants.js";

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("accessToken");
  const username = localStorage.getItem("name");

  if (!token || !username) return;

  const modal = document.getElementById("avatar-modal");
  const chooseBtn = document.getElementById("choose-avatar-btn");
  const closeBtn = document.getElementById("close-modal-btn");
  const preview = document.getElementById("user-avatar");
  const avatars = document.querySelectorAll("[data-avatar]");

  chooseBtn?.addEventListener("click", () => {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  });

  closeBtn?.addEventListener("click", () => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  });

  modal?.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    }
  });

  avatars.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const newAvatarUrl = btn.dataset.avatar;

      try {
        const res = await fetch(
          `${API_BASE}/auction/profiles/${username}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              "X-Noroff-API-Key": API_KEY,
            },
            body: JSON.stringify({
              avatar: { url: newAvatarUrl, alt: "User avatar" },
            }),
          }
        );

        if (!res.ok) throw new Error("Avatar update failed");

        preview.src = newAvatarUrl;
        modal.classList.add("hidden");
        modal.classList.remove("flex");
      } catch (err) {
        alert("Could not update avatar. Try again.");
        console.error(err);
      }
    });
  });
});
