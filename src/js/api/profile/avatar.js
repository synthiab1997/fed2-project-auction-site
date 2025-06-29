const form = document.getElementById("avatarForm");
const name = localStorage.getItem("name");
const token = localStorage.getItem("accessToken");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const url = document.getElementById("avatarUrl").value.trim();

  try {
    const res = await fetch(`https://v2.api.noroff.dev/auction/profiles/${name}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ avatar: { url } })
    });

    const data = await res.json();
    if (res.ok) {
      alert("Avatar updated!");
    } else {
      alert(data.errors?.[0]?.message || "Failed to update avatar.");
    }
  } catch (err) {
    alert("Network error.");
  }
});
