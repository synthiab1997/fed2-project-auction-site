document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const listingId = urlParams.get("id");

  // Redirect if no listing ID is provided
  if (!listingId) {
    alert("No listing ID provided.");
    window.location.href = "/index.html";
    return;
  }

  // DOM Elements
  const listingTitle = document.querySelector(".item-info h1");
  const listingImage = document.querySelector(".main-image img");
  const listingDescription = document.querySelector(".description");
  const listingDeadline = document.querySelector(".deadline span");
  const bidForm = document.getElementById("bid-form");
  const bidAmountInput = document.getElementById("bid-amount");

  // Fetch Listing Details
  const fetchListingDetails = async () => {
    try {
      const response = await fetch(`https://v2.api.noroff.dev/auction/listings/${listingId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch listing details.");
      }

      const listing = await response.json();

      // Populate Listing Details
      listingTitle.textContent = listing.title || "No Title Available";
      listingImage.src = listing.media?.[0]?.url || "/images/default-listing.jpg";
      listingImage.alt = listing.title || "Listing Image";
      listingDescription.textContent = listing.description || "No description available.";
      listingDeadline.textContent = new Date(listing.endsAt).toLocaleString();

      // Populate Additional Media
      const thumbnailsContainer = document.querySelector(".thumbnails");
      thumbnailsContainer.innerHTML = ""; // Clear existing thumbnails
      listing.media?.slice(1).forEach((mediaUrl) => {
        const thumbnail = document.createElement("img");
        thumbnail.src = mediaUrl.url || "/images/default-listing.jpg";
        thumbnail.alt = "Thumbnail";
        thumbnail.className = "h-16 w-16 rounded-lg shadow-md object-cover cursor-pointer";
        thumbnailsContainer.appendChild(thumbnail);

        // Add event listener to change main image on thumbnail click
        thumbnail.addEventListener("click", () => {
          listingImage.src = mediaUrl.url || "/images/default-listing.jpg";
        });
      });
    } catch (error) {
      console.error("Error fetching listing details:", error);
      alert("Failed to load listing details.");
    }
  };

  // Place a Bid
  bidForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const bidAmount = bidAmountInput.value.trim();

    // Validate Bid Amount
    if (!bidAmount || isNaN(bidAmount) || bidAmount <= 0) {
      alert("Please enter a valid bid amount.");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`https://v2.api.noroff.dev/auction/listings/${listingId}/bids`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: parseFloat(bidAmount) }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to place bid.");
      }

      alert("Bid placed successfully!");
      fetchListingDetails(); // Refresh listing details after bid
      bidForm.reset();
    } catch (error) {
      console.error("Error placing bid:", error);
      alert(error.message || "Failed to place bid. Please try again.");
    }
  });

  // Initialize Page
  fetchListingDetails();
});
