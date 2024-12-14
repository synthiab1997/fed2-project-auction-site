document.addEventListener("DOMContentLoaded", async () => {
    const listingsGrid = document.getElementById("listings-grid");
    const pagination = document.getElementById("pagination");
  
    let currentPage = 1;
    const itemsPerPage = 12;
  
    const fetchListings = async (page = 1) => {
      try {
        const response = await fetch(`https://api.noroff.dev/v2/auction/listings?page=${page}&limit=${itemsPerPage}`);
        if (!response.ok) {
          throw new Error("Failed to fetch listings.");
        }
        return await response.json();
      } catch (error) {
        console.error("Error fetching listings:", error);
        return [];
      }
    };
  
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
              <button class="button-primary">Place Bid</button>
              <button class="button-secondary">View Details</button>
            </div>
          </div>
        `;
        listingsGrid.appendChild(card);
      });
    };
  
    const renderPagination = async (totalPages) => {
      pagination.innerHTML = ""; // Clear existing pagination
  
      for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.className = "pagination-button";
        button.onclick = async () => {
          currentPage = i;
          const listings = await fetchListings(i);
          renderListings(listings.items);
        };
        pagination.appendChild(button);
      }
    };
  
    // Initialize Listings and Pagination
    const initializePage = async () => {
      const listings = await fetchListings(currentPage);
      renderListings(listings.items);
      renderPagination(listings.totalPages);
    };
  
    initializePage();
  });
  