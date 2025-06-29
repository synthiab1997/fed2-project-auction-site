document.addEventListener("DOMContentLoaded", initializePage);

async function fetchListings(query = "") {
  const url = query
    ? `https://v2.api.noroff.dev/auction/listings/search?q=${query}&_active=true&_bids=true`
    : `https://v2.api.noroff.dev/auction/listings?_active=true&_bids=true`;

  try {
    const response = await fetch(url);
    const { data } = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Invalid listings data");
    }

    renderListings(data);
  } catch (error) {
    console.error("Error fetching listings:", error);
    const grid = document.getElementById("home-listings-grid");
    if (grid) {
      grid.innerHTML = `<p class="text-red-600">Could not load listings. Please try again later.</p>`;
    }
  }
}

function renderListings(listings) {
  const grid = document.getElementById("home-listings-grid");
  if (!grid) return;

  grid.innerHTML = listings.map(listing => {
    const media = listing.media?.[0]?.url || "/images/placeholder.jpg";
    return `
      <div class="bg-white rounded shadow p-4">
        <img src="${media}" alt="${listing.title}" class="w-full h-48 object-cover mb-2 rounded">
        <h2 class="text-lg font-semibold">${listing.title}</h2>
        <p class="text-sm text-gray-600">${listing.description || "No description"}</p>
        <a href="/listings/single-listing.html?id=${listing.id}" class="button-primary mt-3 inline-block">View</a>
      </div>
    `;
  }).join('');
}

function initializePage() {
  fetchListings(); // You can later add search input and call fetchListings(query)
}
