import { API_BASE, API_KEY } from "../constants.js";

document.addEventListener("DOMContentLoaded", async () => {
  const username = localStorage.getItem("name");
  const token = localStorage.getItem("accessToken");

  const errorEl = document.getElementById("profile-error");

  const nameEl = document.getElementById("user-name");
  const creditsEl = document.getElementById("credits");
  const avatarEl = document.getElementById("user-avatar");

  const listingsContainer = document.getElementById("user-listings");
  const listingsEmptyEl = document.getElementById("listings-empty");

  const bidsContainer = document.getElementById("user-bids");
  const bidsEmptyEl = document.getElementById("bids-empty");
  const bidsErrorEl = document.getElementById("bids-error");

  // --- Guard ---
  if (!username || !token) {
    if (errorEl) errorEl.textContent = "You must be logged in to view your profile.";
    setTimeout(() => (window.location.href = "/auth/login/index.html"), 1200);
    return;
  }

  // --- Helpers ---
  const fallbackImg = "/images/treasure_17947595.png";

  function fmtDate(iso) {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return "—";
    }
  }

  function listingCardHTML(listing) {
    const imgUrl = listing.media?.[0]?.url || fallbackImg;

    return `
      <img src="${imgUrl}" class="listing-image" alt="${listing.title || "Listing image"}" />
      <div class="p-4">
        <h3 class="font-bold text-blue-800 text-lg truncate" title="${listing.title || ""}">
          ${listing.title || "Untitled"}
        </h3>
        <p class="text-gray-600 text-sm mt-1 line-clamp-3">
          ${listing.description || "No description."}
        </p>
        <p class="text-gray-500 text-xs mt-2">
          Ends: ${fmtDate(listing.endsAt)}
        </p>

        <div class="mt-4 flex gap-2">
          <a href="/listings/single/index.html?id=${encodeURIComponent(listing.id)}"
             class="button-light w-full text-center">View</a>

          <a href="/listings/edit/index.html?id=${encodeURIComponent(listing.id)}"
             class="button-secondary w-full text-center">Edit</a>

          <button type="button"
                  data-delete-id="${listing.id}"
                  class="button-danger w-full">
            Delete
          </button>
        </div>
      </div>
    `;
  }

  function bidCardHTML({ listing, myHighestBid }) {
    const imgUrl = listing.media?.[0]?.url || fallbackImg;

    return `
      <img src="${imgUrl}" class="listing-image" alt="${listing.title || "Listing image"}" />
      <div class="p-4">
        <h3 class="font-bold text-blue-800 text-lg truncate" title="${listing.title || ""}">
          ${listing.title || "Untitled"}
        </h3>

        <p class="text-gray-600 text-sm mt-1 line-clamp-2">
          ${listing.description || "No description."}
        </p>

        <div class="mt-3 text-xs text-gray-600 flex flex-col gap-1">
          <p><strong>Your highest bid:</strong> ${myHighestBid}</p>
          <p><strong>Total bids:</strong> ${listing._count?.bids ?? 0}</p>
          <p><strong>Ends:</strong> ${fmtDate(listing.endsAt)}</p>
        </div>

        <div class="mt-4">
          <a href="/listings/single/index.html?id=${encodeURIComponent(listing.id)}"
             class="button-primary w-full block text-center">
            View listing
          </a>
        </div>
      </div>
    `;
  }

  // --- 1) Load Profile + My Listings ---
  async function loadProfileAndListings() {
    const res = await fetch(`${API_BASE}/auction/profiles/${username}?_listings=true`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY,
      },
    });

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        localStorage.clear();
        if (errorEl) errorEl.textContent = "Session expired. Please log in again.";
        setTimeout(() => (window.location.href = "/auth/login/index.html"), 1200);
        return null;
      }
      throw new Error(`Profile fetch failed (${res.status})`);
    }

    const { data } = await res.json();

    // Populate profile
    if (nameEl) nameEl.textContent = data.name;
    if (creditsEl) creditsEl.textContent = data.credits;
    if (avatarEl) avatarEl.src = data.avatar?.url || fallbackImg;

    // Render my listings
    if (listingsContainer) listingsContainer.innerHTML = "";
    if (listingsEmptyEl) listingsEmptyEl.textContent = "";

    const listings = Array.isArray(data.listings) ? data.listings : [];
    if (listings.length === 0) {
      if (listingsEmptyEl) listingsEmptyEl.textContent = "You haven’t created any listings yet.";
      return data;
    }

    listings.forEach((listing) => {
      const card = document.createElement("article");
      card.className = "bg-white rounded-xl shadow-md overflow-hidden flex flex-col";
      card.innerHTML = listingCardHTML(listing);
      listingsContainer?.appendChild(card);
    });

    return data;
  }

  // --- Delete handler (event delegation, ONCE) ---
  function setupDeleteHandler() {
    listingsContainer?.addEventListener("click", async (e) => {
      const btn = e.target.closest("[data-delete-id]");
      if (!btn) return;

      const id = btn.dataset.deleteId;
      if (!id) return;

      const ok = confirm("Delete this listing permanently?");
      if (!ok) return;

      const res = await fetch(`${API_BASE}/auction/listings/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": API_KEY,
        },
      });

      if (!res.ok) {
        alert("Could not delete listing.");
        return;
      }

      btn.closest("article")?.remove();
    });
  }

  // --- 2) Load My Bids (by scanning listings with _bids=true) ---
  async function loadMyBids() {
    if (!bidsContainer || !bidsEmptyEl || !bidsErrorEl) return;

    bidsContainer.innerHTML = "";
    bidsEmptyEl.textContent = "";
    bidsErrorEl.textContent = "";

    // We fetch a few pages of active listings with bids and filter for current user.
    // Listings support _bids=true. :contentReference[oaicite:1]{index=1}
    const MAX_PAGES = 4;      // keep it light
    const PAGE_SIZE = 100;    // if supported; otherwise API ignores
    const found = new Map();  // listingId -> { listing, myHighestBid }

    try {
      for (let page = 1; page <= MAX_PAGES; page++) {
        const url = new URL(`${API_BASE}/auction/listings`);
        url.searchParams.set("_bids", "true");
        url.searchParams.set("_active", "true");
        url.searchParams.set("limit", String(PAGE_SIZE));
        url.searchParams.set("page", String(page));

        const res = await fetch(url.toString(), {
          headers: { "X-Noroff-API-Key": API_KEY },
        });

        if (!res.ok) throw new Error(`Bids scan failed (${res.status})`);

        const { data } = await res.json();
        const listings = Array.isArray(data) ? data : [];

        for (const listing of listings) {
          const bids = Array.isArray(listing.bids) ? listing.bids : [];
          const myBids = bids.filter((b) => b?.bidder?.name === username);

          if (myBids.length) {
            const myHighestBid = Math.max(...myBids.map((b) => Number(b.amount || 0)));
            found.set(listing.id, { listing, myHighestBid });
          }
        }

        // Early exit: if you already have enough to display
        if (found.size >= 12) break;
      }

      if (found.size === 0) {
        bidsEmptyEl.textContent = "No bids found yet. Place a bid on a listing to see it here.";
        return;
      }

      // Render
      const items = Array.from(found.values())
        .sort((a, b) => (b.myHighestBid || 0) - (a.myHighestBid || 0))
        .slice(0, 12);

      for (const item of items) {
        const card = document.createElement("article");
        card.className = "bg-white rounded-xl shadow-md overflow-hidden flex flex-col";
        card.innerHTML = bidCardHTML(item);
        bidsContainer.appendChild(card);
      }
    } catch (err) {
      console.error(err);
      bidsErrorEl.textContent = "Could not load your bids right now. Try again later.";
    }
  }

  // --- Init ---
  try {
    await loadProfileAndListings();
    setupDeleteHandler();
    await loadMyBids();
  } catch (err) {
    console.error(err);
    if (errorEl) errorEl.textContent = "Error loading profile. Please try again.";
  }
});
