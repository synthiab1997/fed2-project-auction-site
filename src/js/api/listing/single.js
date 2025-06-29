const detailEl = document.getElementById("listingDetail");
const form = document.getElementById("bidForm");
const error = document.getElementById("bidError");

const token = localStorage.getItem("accessToken");
const id = new URLSearchParams(window.location.search).get("id");

async function loadDetails() {
  const res = await fetch(`https://v2.api.noroff.dev/auction/listings/${id}?_bids=true`);
  const { data } = await res.json();

  const img = data.media?.[0]?.url || "/images/placeholder.jpg";

  detailEl.innerHTML = `
    <h1 class="text-2xl font-bold">${data.title}</h1>
    <img src="${img}" class="my-4 w-64 rounded" />
    <p>${data.description}</p>
    <h3 class="mt-4 font-semibold">Bids:</h3>
    <ul>${data.bids.map(b => `<li>${b.bidder.name} - $${b.amount}</li>`).join("")}</ul>
  `;
}

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const amount = parseFloat(document.getElementById("amount").value);

  try {
    const res = await fetch(`https://v2.api.noroff.dev/auction/listings/${id}/bids`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ amount })
    });

    if (!res.ok) {
      const { errors } = await res.json();
      error.textContent = errors?.[0]?.message || "Bid failed.";
      return;
    }

    window.location.reload();
  } catch {
    error.textContent = "Network error.";
  }
});

document.addEventListener("DOMContentLoaded", loadDetails);
