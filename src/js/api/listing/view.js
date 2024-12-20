document.addEventListener("DOMContentLoaded", async () => {
    const listingsGrid = document.getElementById("listings-grid");
  
// Fetch all listings
    const fetchListings = async () => {
      try {
        const response = await fetch("https://v2.api.noroff.dev/auction/listings");
        console.log(response);
        if (!response.ok) {
          throw new Error("Failed to fetch listings.");
        }
        return await response.json();
      } catch (error) {
        console.error("Error fetching listings:", error);
        return [];
      }
    };
  
    // Render listings
    const renderListings = async () => {
      const listingsResponse = await fetchListings(); // Fetch response object from the API
      const listings = listingsResponse.data; // Extract the 'data' property, which is an array
      console.log(listings); // Ensure 'listings' is an array
    
      listingsGrid.innerHTML = ""; // Clear existing content
    
      listings.forEach((listing) => {
        console.log(listing); // Log each listing for debugging
    
        const card = document.createElement("div");
        card.className = "bg-white rounded-lg shadow-md overflow-hidden";
    
        // Use a default image if media is empty or undefined
        const mediaUrl = listing.media?.[0] || "/images/bracelet.jpeg";
    
        card.innerHTML = `
          <img
            src="${mediaUrl}"
            alt="${listing.title || 'Listing Image'}"
            class="w-full h-48 object-cover"
          />
          <div class="p-4">
            <h3 class="text-lg font-bold text-blue-800">${listing.title}</h3>
            <p class="text-gray-600 text-sm mt-1">${listing.description || 'No description available.'}</p>
            <p class="text-gray-600 text-sm mt-1">Bids: ${listing._count?.bids || 0}</p>
            <div class="mt-4 flex justify-between">
              <a href="/bids/index.html?id=${listing.id}" class="button-primary">View Bids</a>
              <a href="/listing/single.html?id=${listing.id}" class="button-secondary">View Details</a>
            </div>
          </div>
        `;
    
        listingsGrid.appendChild(card);
      });
    };
    
  });
  