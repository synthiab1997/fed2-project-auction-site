document.addEventListener("DOMContentLoaded", async () => {
  const username = localStorage.getItem("name");
  const token = localStorage.getItem("accessToken");

  if (!username || !token) {
    window.location.href = "/auth/login/index.html";
    return;
  }

  try {
    const res = await fetch(`https://v2.api.noroff.dev/auction/profiles/${username}?_listings=true`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch profile");
    }

    const { data } = await res.json();

    // Populate user data
    document.getElementById("user-name").textContent = data.name;
    document.getElementById("credits").textContent = data.credits;
    document.getElementById("user-avatar").src = data.avatar?.url || "/images/default-avatar.png";

    // Populate user's listings
    const listings = data.listings;
    const listingsContainer = document.getElementById("user-listings");
    if (listings && listings.length) {
      listings.forEach((listing) => {
        const card = document.createElement("div");
        card.className = "bg-white shadow rounded-lg overflow-hidden";

        card.innerHTML = `
          <img src="${listing.media?.[0]?.url || "/images/default-placeholder.png"}" class="w-full h-40 object-cover" alt="${listing.title}" />
          <div class="p-4">
            <h4 class="font-bold text-blue-800 text-lg">${listing.title}</h4>
            <p class="text-gray-600 text-sm mb-2">${listing.description || "No description."}</p>
            <p class="text-gray-500 text-xs">Ends: ${new Date(listing.endsAt).toLocaleString()}</p>
          </div>
        `;

        listingsContainer.appendChild(card);
      });
    } else {
      listingsContainer.innerHTML = `<p class="text-gray-600 text-center col-span-full">No listings yet.</p>`;
    }

  } catch (err) {
    console.error("Failed to load profile:", err);
    alert("Error loading profile data.");
  }
});
