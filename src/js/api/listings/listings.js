import { API_BASE, API_KEY } from "../constants.js";
import { getRemainingTime, startCountdownUpdater } from "../utils/time.js";

const FALLBACK_IMAGE = "/images/treasure_17947595.png";

// Pagination //
const ITEMS_PER_PAGE = 9;
let currentPage = 1;

// Data state //
let allListings = [];
let filteredListings = [];

document.addEventListener("DOMContentLoaded", () => {
  // DOM ELEMENTS // 
  const grid = document.getElementById("listings-grid");
  const errorEl = document.getElementById("listings-error");
  const emptyEl = document.getElementById("listings-empty");
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");
  const clearBtn = document.getElementById("clear-search");

  const sortSelect = document.getElementById("sort-select");
  const filterHot = document.getElementById("filter-hot");
  const filterSoon = document.getElementById("filter-soon");

  // HELPERS// 
  function setLoading() {
    if (!grid) return;
    grid.innerHTML = `
      <p class="col-span-full text-center text-white/80">
        Loading listings…
      </p>
    `;
    errorEl.textContent = "";
    emptyEl.textContent = "";
  }

  function safeImage(url) {
    if (!url || typeof url !== "string") return FALLBACK_IMAGE;
    if (!url.startsWith("http")) return FALLBACK_IMAGE;
    return url;
  }

  // FILTERS + SORT// 
  function applyFilters() {
    let filtered = [...allListings];
    const now = Date.now();

    // 🔥 Hot listings
    if (filterHot?.checked) {
      filtered = filtered.filter(
        (l) => (l._count?.bids ?? 0) >= 5
      );
    }

    // ⏰ Ending soon (24h)
    if (filterSoon?.checked) {
      filtered = filtered.filter((l) => {
        if (!l.endsAt) return false;
        const ends = new Date(l.endsAt).getTime();
        return ends > now && ends - now < 24 * 60 * 60 * 1000;
      });
    }

    // 🔃 Sorting
    switch (sortSelect?.value) {
      case "ends-soon":
        filtered.sort((a, b) => new Date(a.endsAt) - new Date(b.endsAt));
        break;

      case "ends-late":
        filtered.sort((a, b) => new Date(b.endsAt) - new Date(a.endsAt));
        break;

      case "bids-high":
        filtered.sort(
          (a, b) => (b._count?.bids ?? 0) - (a._count?.bids ?? 0)
        );
        break;
    }

    filteredListings = filtered;
    currentPage = 1;
    renderPaginated();
  }

  // RENDER LISTINGS //
  
  function renderListings(listings) {
    if (!grid) return;

    grid.innerHTML = "";
    errorEl.textContent = "";
    emptyEl.textContent = "";

    if (!Array.isArray(listings) || listings.length === 0) {
      emptyEl.textContent = "No listings available.";
      return;
    }

    listings.forEach((listing) => {
      const card = document.createElement("article");
      card.className = "listing-card";

      const imageUrl = safeImage(listing.media?.[0]?.url);
      const bidsCount = listing._count?.bids ?? 0;
      const countdown = getRemainingTime(listing.endsAt);

      card.innerHTML = `
        <div class="listing-image-wrapper">
          <img
            src="${imageUrl}"
            alt="${listing.title}"
            loading="lazy"
            onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}';"
          />
        </div>

        <div class="p-4 flex flex-col gap-2 flex-1">
          <h2 class="font-bold text-blue-900 text-lg truncate" title="${listing.title}">
            ${listing.title}
          </h2>

          <p class="text-gray-700 text-sm line-clamp-2">
            ${listing.description || "No description provided."}
          </p>

          <div class="flex items-center justify-between text-xs listing-meta mt-auto">
            <span>Bids: <strong>${bidsCount}</strong></span>
            <span class="countdown ${countdown.class}">
              ${countdown.text}
            </span>
          </div>

          <a
            href="/listings/single/index.html?id=${encodeURIComponent(listing.id)}"
            class="button-primary w-full text-center mt-3"
          >
            View listing
          </a>
        </div>
      `;

      grid.appendChild(card);
    });

    startCountdownUpdater();
  }

  // PAGINATION //
  function renderPaginated() {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const pageItems = filteredListings.slice(start, end);

    renderListings(pageItems);
    renderPaginationControls();
  }

  function renderPaginationControls() {
    const container = document.getElementById("pagination");
    if (!container) return;

    container.innerHTML = "";

    const totalPages = Math.ceil(filteredListings.length / ITEMS_PER_PAGE);
    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.className = `pagination-button ${i === currentPage ? "active" : ""}`;

      btn.addEventListener("click", () => {
        currentPage = i;
        renderPaginated();
      });

      container.appendChild(btn);
    }
  }

  // FETCH// 
  async function fetchListings(url) {
    try {
      setLoading();

      const res = await fetch(url, {
        headers: { "X-Noroff-API-Key": API_KEY },
      });

      if (!res.ok) throw new Error(`Failed (${res.status})`);

      const { data } = await res.json();
      allListings = data;
      filteredListings = data;
      currentPage = 1;

      renderPaginated();
    } catch (err) {
      console.error(err);
      errorEl.textContent = "Error loading listings. Please try again.";
    }
  }

  function loadAllListings() {
    fetchListings(`${API_BASE}/auction/listings?_bids=true&_active=true`);
  }

  function searchListings(term) {
    const trimmed = term.trim();
    if (!trimmed) {
      loadAllListings();
      return;
    }

    fetchListings(
      `${API_BASE}/auction/listings/search?q=${encodeURIComponent(trimmed)}&_bids=true&_active=true`
    );
  }

  // LISTENERS// 
  searchForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    searchListings(searchInput.value);
  });

  clearBtn?.addEventListener("click", () => {
    searchInput.value = "";
    loadAllListings();
  });

  sortSelect?.addEventListener("change", applyFilters);
  filterHot?.addEventListener("change", applyFilters);
  filterSoon?.addEventListener("change", applyFilters);

  // INIT// 
  loadAllListings();
});
