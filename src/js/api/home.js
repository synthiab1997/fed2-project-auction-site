document.addEventListener("DOMContentLoaded", async () => {
    const listingsGrid = document.getElementById("listings-grid");
    const pagination = document.getElementById("pagination");
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search-input");
  
    let currentPage = 1;
    const itemsPerPage = 12;
  
    // Fetch listings from API
    const fetchListings = async (page = 1, searchQuery = "") => {
      try {
        const response = await fetch(
          `https://api.noroff.dev/v2/auction/listings?page=${page}&limit=${itemsPerPage}&search=${searchQuery}`
        );
  
        if (!response.ok) {
          throw new Error("Failed to fetch listings.");
        }
  
        return await response.json();
      } catch (error) {
        console.error("Error fetching listings:", error);
        return { items: [], totalPages: 1 };
      }
    };
  
    // Render listings to the grid
    const renderListings = (listings) => {
      listingsGrid.innerHTML = ""; // Clear existing listings
  
      listings.forEach((listing) => {
        const card = document.createElement("div");
        card.className = "bg-white rounded-lg shadow-md overflow-hidden";
  
        card.innerHTML = `
          <img
            src="${listing.media[0] || '/images/default-listing.jpg'}"
            alt="${listing.title || 'Listing Image'}"
            class="w-full h-48 object-cover"
          />
          <div class="p-4">
            <h3 class="text-lg font-bold text-blue-800">${listing.title}</h3>
            <p class="text-gray-600 text-sm mt-1">${listing.description || 'No description available.'}</p>
            <p class="text-gray-600 text-sm mt-1">Bids: ${listing._count.bids || 0}</p>
            <div class="mt-4 flex justify-between">
              <a href="/listing/${listing.id}" class="button-primary">Place Bid</a>
              <a href="/listing/${listing.id}" class="button-secondary">View Details</a>
            </div>
          </div>
        `;
        listingsGrid.appendChild(card);
      });
    };
  
    // Render pagination buttons
    const renderPagination = (totalPages) => {
      pagination.innerHTML = ""; // Clear existing pagination
  
      for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.className = `pagination-button ${i === currentPage ? "active" : ""}`;
        button.onclick = async () => {
          currentPage = i;
          const { items } = await fetchListings(i, searchInput.value);
          renderListings(items);
        };
        pagination.appendChild(button);
      }
    };
  
    // Initialize page with listings and pagination
    const initializePage = async () => {
      const { items, totalPages } = await fetchListings(currentPage, searchInput.value);
      renderListings(items);
      renderPagination(totalPages);
    };
  
    // Search functionality
    searchForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      currentPage = 1; // Reset to first page for search
      await initializePage();
    });
  
    // Load initial listings
    initializePage();
  });
  