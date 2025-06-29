document.addEventListener("DOMContentLoaded", () => {
  const listingForm = document.getElementById("listing-form");
  const toggleButton = document.getElementById("toggle-form-btn");
  const cancelFormButton = document.getElementById("cancel-form-btn");
  const createFormSection = document.getElementById("create-listing-form");
  const token = localStorage.getItem("accessToken");

  // Toggle form visibility
  toggleButton?.addEventListener("click", () => {
    createFormSection.classList.toggle("hidden");
    listingForm.reset();
    listingForm.removeAttribute("data-edit-id");
  });

  // Cancel button
  cancelFormButton?.addEventListener("click", () => {
    listingForm.reset();
    createFormSection.classList.add("hidden");
    listingForm.removeAttribute("data-edit-id");
  });

  // Form submit
  listingForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const mediaUrl = document.getElementById("media").value.trim();
    const endsAt = new Date(document.getElementById("deadline").value).toISOString();

    const payload = {
      title,
      description,
      endsAt,
      media: [{ url: mediaUrl, alt: title }]
    };

    const isEdit = listingForm.dataset.editId;
    const url = isEdit
      ? `https://v2.api.noroff.dev/auction/listings/${isEdit}`
      : "https://v2.api.noroff.dev/auction/listings";

    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        alert(isEdit ? "Listing updated!" : "Listing created!");
        listingForm.reset();
        listingForm.removeAttribute("data-edit-id");
        createFormSection.classList.add("hidden");
        location.reload();
      } else {
        alert(data.errors?.[0]?.message || "Operation failed.");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Something went wrong.");
    }
  });
});
