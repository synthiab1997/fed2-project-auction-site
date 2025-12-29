import { API_BASE, API_KEY } from "./constants.js";

const FALLBACK_IMAGE = "/images/treasure_17947595.png";

document.addEventListener("DOMContentLoaded", () => {
  const latestGrid = document.getElementById("home-listings-grid");
  const trendingGrid = document.getElementById("trending-listings-grid");
  const errorEl = document.getElementById("home-error");
  const trendingErrorEl = document.getElementById("trending-error");

  const searchForm = document.getElementById("home-search-form");
  const searchInput = document.getElementById("home-search-input");

  function renderCards(grid, listings) {
    if (!grid) return;
    grid.innerHTML = "";

    listings.slice(0, 6).forEach((listing) => {
      const img = listing.media?.[0]?.url || FALLBACK_IMAGE;
      const bidsCount = listing._count?.bids ?? 0;

      const card = document.createElement("article");
      card.className = "listing-card";

      card.innerHTML = `
        <div class="listing-image-wrapper">
          <img
            src="${img}"
            alt="${listing.title}"
            loading="lazy"
            onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}';"
          />
        </div>

        <div class="p-4 flex flex-col gap-2 flex-1">
          <h3 class="font-bold text-blue-800 text-lg truncate" title="${listing.title}">
            ${listing.title}
          </h3>

          <p class="text-gray-600 text-sm line-clamp-2">
            ${listing.description || "No description."}
          </p>

          <div class="flex items-center justify-between text-xs text-gray-500 mt-auto">
            <span>Bids: <span class="font-semibold">${bidsCount}</span></span>
          </div>

          <a href="/listings/single/?id=${encodeURIComponent(listing.id)}"
            class="button-primary w-full block text-center mt-2">
            View listing
          </a>
        </div>
      `;

      grid.appendChild(card);
    });
  }

  async function loadLatest() {
    try {
      const res = await fetch(`${API_BASE}/auction/listings?_bids=true&_active=true`, {
        headers: { "X-Noroff-API-Key": API_KEY },
      });
      if (!res.ok) throw new Error("Latest failed");
      const { data } = await res.json();
      renderCards(latestGrid, data);
    } catch (err) {
      console.error(err);
      if (errorEl) errorEl.textContent = "Could not load latest listings.";
    }
  }

  async function loadTrending() {
    try {
      const res = await fetch(`${API_BASE}/auction/listings?_bids=true&_active=true`, {
        headers: { "X-Noroff-API-Key": API_KEY },
      });
      if (!res.ok) throw new Error("Trending failed");
      const { data } = await res.json();

      // trending = tri par bids desc
      const sorted = [...data].sort((a, b) => (b._count?.bids ?? 0) - (a._count?.bids ?? 0));
      renderCards(trendingGrid, sorted);
    } catch (err) {
      console.error(err);
      if (trendingErrorEl) trendingErrorEl.textContent = "Could not load trending listings.";
    }
  }

  // Search -> redirect listings with query
  searchForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const term = searchInput?.value?.trim() || "";
    window.location.href = `/listings/index.html?q=${encodeURIComponent(term)}`;
  });

  loadLatest();
  loadTrending();
});
