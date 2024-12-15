document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const listingId = urlParams.get("id");
  
    if (!listingId) {
      alert("No listing ID provided.");
      window.location.href = "/index.html";
      return;
    }
  
    const listingTitle = document.getElementById("listing-title");
    const listingImage = document.getElementById("listing-image");
    const listingDescription = document.getElementById("listing-description");
    const listingDeadline = document.getElementById("listing-deadline");
    const listingBids = document.getElementById("listing-bids");
    const bidForm = document.getElementById("bid-form");
    const bidAmountInput = document.getElementById("bid-amount");
  
    // Fetch Listing Details
    const fetchListingDetails = async () => {
      try {
        const response = await fetch(`https://api.noroff.dev/v2/auction/listings/${listingId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch listing details.");
        }
  
        const listing = await response.json();
  
        // Populate Listing Details
        listingTitle.textContent = listing.title;
        listingImage.innerHTML = `<img src="${listing.media[0] || '/images/default-listing.jpg'}" alt="${listing.title}" class="w-full h-64 object-cover rounded">`;
        listingDescription.textContent = listing.description;
        listingDeadline.textContent = `Ends at: ${new Date(listing.endsAt).toLocaleString()}`;
        listingBids.textContent = `Current Bids: ${listing._count.bids || 0}`;
      } catch (error) {
        console.error("Error fetching listing details:", error);
        alert("Failed to load listing details.");
      }
    };
  
    // Place a Bid
    bidForm.addEventListener("submit", async (event) => {
      event.preventDefault();
  
      const bidAmount = bidAmountInput.value.trim();
  
      if (!bidAmount || isNaN(bidAmount) || bidAmount <= 0) {
        alert("Please enter a valid bid amount.");
        return;
      }
  
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`https://api.noroff.dev/v2/auction/listings/${listingId}/bids`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount: parseFloat(bidAmount) }),
        });
  
        if (!response.ok) {
          throw new Error("Failed to place bid.");
        }
  
        const result = await response.json();
        alert("Bid placed successfully!");
        fetchListingDetails(); // Refresh listing details after bid
        bidForm.reset();
      } catch (error) {
        console.error("Error placing bid:", error);
        alert("Failed to place bid. Please try again.");
      }
    });
  
    // Initialize Page
    fetchListingDetails();
  });
  