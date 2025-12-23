document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const listingsGrid = document.getElementById("listings-grid");
  
    const renderListings = (listings) => {
      listingsGrid.innerHTML = listings
        .map((listing) => {
          const media = listing.media?.[0]?.url || "images/painting img.jpeg";
          return `
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
              <img src="${media}" alt="${listing.title}" class="w-full h-48 object-cover" />
              <div class="p-4">
                <h3 class="text-lg font-bold text-blue-800">${listing.title}</h3>
                <p class="text-gray-600 text-sm">${listing.description || "No description"}</p>
                <p class="text-gray-600 text-sm">Bids: ${listing._count?.bids || 0}</p>
                <a href="/listings/single-listing.html?id=${listing.id}" class="button-primary mt-2 inline-block">View Listing</a>
              </div>
            </div>
          `;
        })
        .join("");
    };
  
    const searchListings = async (query) => {
      try {
        const res = await fetch(`https://v2.api.noroff.dev/auction/listings/search?q=${query}&_active=true`);
        const { data } = await res.json();
        renderListings(data);
      } catch (error) {
        listingsGrid.innerHTML = `<p class="text-red-600">Failed to load search results.</p>`;
        console.error("Search error:", error);
      }
    };
  
    searchButton?.addEventListener("click", () => {
      const query = searchInput.value.trim();
      if (query) {
        searchListings(query);
      }
    });
  
    // Optional: search on Enter key
    searchInput?.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        searchButton.click();
      }
    });
  });
  