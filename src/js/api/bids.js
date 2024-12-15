document.addEventListener("DOMContentLoaded", async () => {
    const listingId = new URLSearchParams(window.location.search).get("id");
    const listingTitle = document.getElementById("listing-title");
    const listingDescription = document.getElementById("listing-description");
    const listingDeadline = document.getElementById("listing-deadline");
    const bidsList = document.getElementById("bids-list");
    const bidForm = document.getElementById("bid-form");
  
    // Fetch listing details and bids
    const fetchListingDetails = async () => {
      try {
        const response = await fetch(`https://api.noroff.dev/v2/auction/listings/${listingId}`);
        if (!response.ok) throw new Error("Failed to fetch listing details.");
  
        const listing = await response.json();
  
        // Populate listing details
        listingTitle.textContent = listing.title;
        listingDescription.textContent = listing.description;
        listingDeadline.querySelector("span").textContent = new Date(listing.endsAt).toLocaleString();
  
        // Populate bids
        if (listing.bids.length) {
          bidsList.innerHTML = listing.bids
            .map(
              (bid) => `
            <div class="p-4 border-b">
              <p class="text-gray-700">Bidder: ${bid.bidderName || "Anonymous"}</p>
              <p class="text-gray-700">Amount: ${bid.amount} credits</p>
            </div>`
            )
            .join("");
        } else {
          bidsList.innerHTML = `<p class="text-gray-500 text-sm">No bids yet.</p>`;
        }
      } catch (error) {
        console.error("Error fetching listing details:", error);
        listingTitle.textContent = "Error loading listing.";
        listingDescription.textContent = "";
        bidsList.innerHTML = `<p class="text-red-500">Failed to load bids.</p>`;
      }
    };
  
    // Handle bid form submission
    bidForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const bidAmount = document.getElementById("bid-amount").value;
  
      try {
        const response = await fetch(`https://api.noroff.dev/v2/auction/listings/${listingId}/bids`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({ amount: parseInt(bidAmount, 10) }),
        });
  
        if (!response.ok) throw new Error("Failed to place bid.");
  
        alert("Bid placed successfully!");
        bidForm.reset();
        fetchListingDetails(); // Reload listing details
      } catch (error) {
        console.error("Error placing bid:", error);
        alert("Failed to place bid. Please try again.");
      }
    });
  
    fetchListingDetails(); // Load listing details on page load
  });
  