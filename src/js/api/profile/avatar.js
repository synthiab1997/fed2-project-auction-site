document.addEventListener("DOMContentLoaded", () => {
  const avatarModal = document.getElementById("avatar-modal");
  const avatarUploadButton = document.getElementById("choose-avatar-btn");
  const closeModalButton = document.getElementById("close-modal-btn");
  const avatarImages = document.querySelectorAll("[data-avatar]");
  const userAvatar = document.getElementById("user-avatar");

  // Open the modal
  avatarUploadButton.addEventListener("click", () => {
    avatarModal.classList.remove("hidden");
    avatarModal.classList.add("flex");
  });

  // Close the modal
  closeModalButton.addEventListener("click", () => {
    avatarModal.classList.add("hidden");
  });

  // Preview and select avatar
  avatarImages.forEach((avatar) => {
    avatar.addEventListener("click", (event) => {
      const newAvatar = avatar.getAttribute("data-avatar");
      userAvatar.setAttribute("src", newAvatar); // Update avatar preview
      avatarModal.classList.add("hidden"); // Close modal
    });
  });
});
