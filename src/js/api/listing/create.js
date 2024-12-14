const fetchListings = async () => {
    const token = localStorage.getItem("accessToken");
  
    try {
      const response = await fetch("https://api.noroff.dev/v2/auction/listings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch listings.");
      }
  
      const listings = await response.json();
      const listingsGrid = document.getElementById("listings-grid");
  
      // Clear the grid
      listingsGrid.innerHTML = "";
  
      // Loop through listings and create cards
      listings.forEach((listing) => {
        const card = document.createElement("div");
        card.classList.add("bg-white", "rounded-lg", "shadow-md", "overflow-hidden");
  
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
            <div class="mt-4 flex justify-between items-center">
              <button class="button-primary">Place Bid</button>
              <div class="space-x-2">
                <button class="button-secondary">Edit</button>
                <button class="button-danger">Delete</button>
              </div>
            </div>
          </div>
        `;
  
        listingsGrid.appendChild(card);
      });
    } catch (error) {
      console.error("Error fetching listings:", error);
    }
  };
  
  const createListing = async (listingData) => {
    const token = localStorage.getItem("accessToken");
  
    try {
      const response = await fetch("https://api.noroff.dev/v2/auction/listings", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(listingData),
      });
  
      if (!response.ok) {
        throw new Error("Failed to create listing.");
      }
  
      const newListing = await response.json();
      return newListing;
    } catch (error) {
      console.error("Error creating listing:", error);
      throw error;
    }
  };
  
  document.addEventListener("DOMContentLoaded", () => {
    const toggleButton = document.getElementById("toggle-form-btn");
    const createFormSection = document.getElementById("create-listing-form");
    const cancelFormButton = document.getElementById("cancel-form-btn");
    const listingForm = document.getElementById("listing-form");
    const listingsGrid = document.getElementById("listings-grid");
  
    // Fetch Listings on Load
    fetchListings();
  
    // Toggle Form Visibility
    if (toggleButton) {
      toggleButton.addEventListener("click", () => {
        createFormSection.classList.toggle("hidden");
      });
    }
  
    // Cancel Button Logic
    if (cancelFormButton) {
      cancelFormButton.addEventListener("click", () => {
        listingForm.reset(); // Clear the form
        createFormSection.classList.add("hidden"); // Hide the form
      });
    }
  
    // Handle Form Submission
    if (listingForm) {
      listingForm.addEventListener("submit", async (event) => {
        event.preventDefault();
  
        // Collect form data
        const title = document.getElementById("title").value.trim();
        const description = document.getElementById("description").value.trim();
        const deadline = document.getElementById("deadline").value;
        const mediaFiles = document.getElementById("media").files;
  
        const media = [];
        for (let i = 0; i < mediaFiles.length; i++) {
          // Using local URL preview for simplicity
          media.push(URL.createObjectURL(mediaFiles[i]));
        }
  
        const listingData = {
          title,
          description,
          endsAt: new Date(deadline).toISOString(),
          media,
        };
  
        try {
          const newListing = await createListing(listingData);
  
          // Add new listing to the grid
          const listingCard = document.createElement("div");
          listingCard.classList.add("bg-white", "rounded-lg", "shadow-md", "overflow-hidden");
  
          listingCard.innerHTML = `
            <img
              src="${newListing.media[0] || '/images/default-listing.jpg'}"
              alt="${newListing.title || 'Listing Image'}"
              class="w-full h-48 object-cover"
            />
            <div class="p-4">
              <h3 class="text-lg font-bold text-blue-800">${newListing.title}</h3>
              <p class="text-gray-600 text-sm mt-1">${newListing.description}</p>
              <p class="text-gray-600 text-sm mt-1">Bids: ${newListing._count?.bids || 0}</p>
              <div class="mt-4 flex justify-between items-center">
                <button class="button-primary">Place Bid</button>
                <div class="flex space-x-2">
                  <button class="button-secondary">Edit</button>
                  <button class="button-danger">Delete</button>
                </div>
              </div>
            </div>
          `;
  
          listingsGrid.appendChild(listingCard);
  
          // Reset and hide the form
          listingForm.reset();
          createFormSection.classList.add("hidden");
        } catch (error) {
          alert("Failed to create listing. Please try again.");
        }
      });
    }
  });
  