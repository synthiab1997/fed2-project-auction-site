document.addEventListener("DOMContentLoaded", () => {
  const avatarImages = document.querySelectorAll("[data-avatar]");
  const preview = document.getElementById("user-avatar");
  const modal = document.getElementById("avatar-modal");
  const openBtn = document.getElementById("choose-avatar-btn");
  const closeBtn = document.getElementById("close-modal-btn");

  const name = localStorage.getItem("name");
  const token = localStorage.getItem("accessToken");

  // Validate login
  if (!name || !token) {
    window.location.href = "/auth/login/index.html";
    return;
  }

  // Open/close modal
  openBtn?.addEventListener("click", () => modal.classList.remove("hidden"));
  closeBtn?.addEventListener("click", () => modal.classList.add("hidden"));

  // Handle avatar selection
  avatarImages.forEach((img) => {
    img.addEventListener("click", async () => {
      const url = img.getAttribute("data-avatar");
      try {
        const res = await fetch(`https://v2.api.noroff.dev/auction/profiles/${name}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            avatar: {
              url: url,
              alt: "User avatar",
            },
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.errors?.[0]?.message || "Update failed.");
        }

        // Update avatar on page
        preview.src = url;
        modal.classList.add("hidden");
        alert("Avatar updated successfully!");
      } catch (error) {
        console.error("Error updating avatar:", error.message);
        alert("Error updating avatar. Check token or URL.");
      }
    });
  });
});
