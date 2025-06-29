document.addEventListener("DOMContentLoaded", async () => {
  const username = localStorage.getItem("name");
  const token = localStorage.getItem("accessToken");

  if (!username || !token) {
    window.location.href = "/auth/login/index.html";
    return;
  }

  try {
    const res = await fetch(`https://v2.api.noroff.dev/auction/profiles/${username}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const { data } = await res.json();

    document.getElementById("username").textContent = data.name;
    document.getElementById("credits").textContent = `Credits: ${data.credits}`;
    document.getElementById("user-avatar").src = data.avatar?.url || "/images/default-avatar.png";
  } catch (err) {
    console.error("Failed to load profile", err);
  }
});
