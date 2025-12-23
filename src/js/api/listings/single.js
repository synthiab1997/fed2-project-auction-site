import { API_KEY, API_AUCTION_LISTINGS_ID, API_AUCTION_BID_LISTING } from "../constants.js";
import { getRemainingTime, startCountdownUpdater } from "../utils/time.js";


document.addEventListener("DOMContentLoaded", () => {
  const id = new URLSearchParams(window.location.search).get("id");

  const token = localStorage.getItem("accessToken");

  const errorEl = document.getElementById("single-error");

  const imgEl = document.getElementById("listing-image");
  const titleEl = document.getElementById("listing-title");
  const descEl = document.getElementById("listing-description");
  const endsEl = document.getElementById("listing-ends");
  const bidsCountEl = document.getElementById("listing-bids-count");
  const highestBidEl = document.getElementById("listing-highest-bid");

  const bidsListEl = document.getElementById("bids-list");

  const bidForm = document.getElementById("bid-form");
  const bidAmountEl = document.getElementById("bid-amount");
  const bidInfo = document.getElementById("bid-info");
  const bidError = document.getElementById("bid-error");
  const bidSuccess = document.getElementById("bid-success");

  const FALLBACK_IMAGE = "/images/treasure_17947595.png";

  if (!id) {
    if (errorEl) errorEl.textContent = "Missing listing ID.";
    return;
  }

  function safeImageUrl(data) {
    const url = data?.media?.[0]?.url;
    if (!url || typeof url !== "string") return FALLBACK_IMAGE;
    if (!url.startsWith("http://") && !url.startsWith("https://")) return FALLBACK_IMAGE;
    return url;
  }

  function formatDate(dateStr) {
    try {
      return new Date(dateStr).toLocaleString();
    } catch {
      return "Unknown";
    }
  }

  function computeHighestBid(bids) {
    if (!Array.isArray(bids) || bids.length === 0) return 0;
    return Math.max(...bids.map((b) => b.amount || 0));
  }

  function renderBids(bids) {
    if (!bidsListEl) return;

    if (!Array.isArray(bids) || bids.length === 0) {
      bidsListEl.innerHTML = `<p class="text-white/80">No bids yet.</p>`;
      return;
    }

    const sorted = [...bids].sort((a, b) => new Date(b.created) - new Date(a.created));

    bidsListEl.innerHTML = sorted
      .map((b) => {
        const bidder = b.bidder?.name || "Unknown";
        const amount = b.amount ?? 0;
        const created = b.created ? formatDate(b.created) : "";
        return `
          <div class="bg-white/95 text-blue-900 rounded-lg p-4 flex items-center justify-between gap-3">
            <div class="min-w-0">
              <p class="font-bold truncate">${bidder}</p>
              <p class="text-xs text-gray-600">${created}</p>
            </div>
            <div class="font-bold text-blue-800 whitespace-nowrap">
              ${amount} credits
            </div>
          </div>
        `;
      })
      .join("");
  }

  async function loadListing() {
    try {
      if (errorEl) errorEl.textContent = "";

      const res = await fetch(`${API_AUCTION_LISTINGS_ID(id)}?_bids=true`, {
        headers: { "X-Noroff-API-Key": API_KEY },
      });

      if (!res.ok) throw new Error(`Failed to load listing (status ${res.status})`);

      const { data } = await res.json();

      // Fill UI
      if (titleEl) titleEl.textContent = data.title || "Untitled";
      if (descEl) descEl.textContent = data.description || "No description provided.";
      if (endsEl && data.endsAt) {
        const countdown = getRemainingTime(data.endsAt);
        endsEl.textContent = countdown.text;
        endsEl.dataset.endsAt = data.endsAt;
        endsEl.classList.add(
          "countdown",
          countdown.status === "soon"
            ? "countdown-soon"
            : countdown.status === "ended"
            ? "countdown-ended"
            : "countdown-normal"
        );
      }
      

      const bids = data.bids || [];
      if (bidsCountEl) bidsCountEl.textContent = String(bids.length);
      const highest = computeHighestBid(bids);
      if (highestBidEl) highestBidEl.textContent = String(highest);

      if (imgEl) {
        imgEl.src = safeImageUrl(data);
        imgEl.onerror = () => (imgEl.src = FALLBACK_IMAGE);
      }

      // Bid box info
      const isEnded = data.endsAt ? new Date(data.endsAt) <= new Date() : false;

      if (!token) {
        if (bidInfo) bidInfo.textContent = "Login required to place a bid.";
        bidForm?.querySelector("button")?.setAttribute("disabled", "true");
        bidAmountEl?.setAttribute("disabled", "true");
      } else if (isEnded) {
        if (bidInfo) bidInfo.textContent = "This listing has ended. Bidding is closed.";
        bidForm?.querySelector("button")?.setAttribute("disabled", "true");
        bidAmountEl?.setAttribute("disabled", "true");
      } else {
        if (bidInfo) bidInfo.textContent = "Enter an amount higher than the current highest bid.";
        bidForm?.querySelector("button")?.removeAttribute("disabled");
        bidAmountEl?.removeAttribute("disabled");
        if (bidAmountEl) bidAmountEl.min = String(Math.max(1, highest + 1));
      }

      renderBids(bids);
    } catch (err) {
      console.error(err);
      if (errorEl) errorEl.textContent = "Could not load this listing. Please try again.";
      if (bidsListEl) bidsListEl.innerHTML = "";
    }
  }

  // Submit bid
  bidForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (bidError) bidError.textContent = "";
    if (bidSuccess) bidSuccess.textContent = "";

    if (!token) {
      if (bidError) bidError.textContent = "You must be logged in to bid.";
      return;
    }

    const amount = Number(bidAmountEl?.value || 0);

    if (!Number.isFinite(amount) || amount <= 0) {
      if (bidError) bidError.textContent = "Please enter a valid amount.";
      return;
    }

    try {
      const res = await fetch(API_AUCTION_BID_LISTING(id), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": API_KEY,
        },
        body: JSON.stringify({ amount }),
      });

      const json = await res.json();

      if (!res.ok) {
        if (bidError) bidError.textContent = json?.errors?.[0]?.message || "Bid failed.";
        return;
      }

      if (bidSuccess) bidSuccess.textContent = "Bid placed successfully!";
      if (bidAmountEl) bidAmountEl.value = "";

      // refresh listing & bids
      await loadListing();
    } catch (err) {
      console.error(err);
      if (bidError) bidError.textContent = "Network error. Please try again.";
    }
  });

  loadListing();

  startCountdownUpdater();

  
});
