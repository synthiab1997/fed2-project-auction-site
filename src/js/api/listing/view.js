document.addEventListener("DOMContentLoaded", () => {
  const listingsGrid = document.getElementById("listings-grid");
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");
  const currentUser = localStorage.getItem("name");
  const token = localStorage.getItem("accessToken");

  const renderListings = (listings) => {
    listingsGrid.innerHTML = listings.map(listing => {
      const media = listing.media?.[0]?.url || "/images/placeholder.jpg";
      const isOwner = listing.seller?.name === currentUser;

      return `
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <img src="${media}" alt="${listing.title}" class="w-full h-48 object-cover" />
          <div class="p-4">
            <h3 class="text-lg font-bold text-blue-800">${listing.title}</h3>
            <p class="text-gray-600 text-sm">${listing.description || "No description"}</p>
            <p class="text-gray-600 text-sm">Bids: ${listing._count?.bids || 0}</p>
            <div class="mt-4 flex flex-wrap gap-2">
              <a href="/listings/single-listing.html?id=${listing.id}" class="button-primary">View</a>
              ${isOwner ? `
                <button class="button-secondary edit-btn" data-id="${listing.id}">Edit</button>
                <button class="button-danger delete-btn" data-id="${listing.id}">Delete</button>
              ` : ""}
            </div>
          </div>
        </div>
      `;
    }).join("");

    attachEditDeleteHandlers();
  };

  const fetchListings = async (query = "") => {
    try {
      const url = query
        ? `https://v2.api.noroff.dev/auction/listings/search?q=${query}&_active=true&_bids=true`
        : `https://v2.api.noroff.dev/auction/listings?_active=true&_bids=true`;

      const res = await fetch(url);
      const { data } = await res.json();
      renderListings(data);
    } catch (err) {
      console.error("Error fetching listings:", err);
      listingsGrid.innerHTML = `<p class="text-red-600">Failed to load listings.</p>`;
    }
  };

  const attachEditDeleteHandlers = () => {
    document.querySelectorAll(".delete-btn").forEach(button => {
      button.addEventListener("click", async () => {
        const id = button.dataset.id;
        if (!confirm("Are you sure you want to delete this listing?")) return;

        try {
          const res = await fetch(`https://v2.api.noroff.dev/auction/listings/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.status === 204) {
            alert("Listing deleted.");
            fetchListings();
          } else {
            alert("Failed to delete listing.");
          }
        } catch (err) {
          console.error("Delete error:", err);
          alert("Error deleting listing.");
        }
      });
    });

    document.querySelectorAll(".edit-btn").forEach(button => {
      button.addEventListener("click", async () => {
        const id = button.dataset.id;

        try {
          const res = await fetch(`https://v2.api.noroff.dev/auction/listings/${id}`);
          const { data } = await res.json();

          document.getElementById("title").value = data.title;
          document.getElementById("description").value = data.description;
          document.getElementById("media").value = data.media?.[0]?.url || "";
          document.getElementById("deadline").value = data.endsAt.slice(0, 10);

          document.getElementById("create-listing-form").classList.remove("hidden");
          document.getElementById("listing-form").dataset.editId = id;
        } catch (err) {
          console.error("Edit load error:", err);
          alert("Failed to load listing for edit.");
        }
      });
    });
  };

  searchButton?.addEventListener("click", () => {
    const query = searchInput.value.trim();
    fetchListings(query);
  });

  searchInput?.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      searchButton.click();
    }
  });

  fetchListings();
});
