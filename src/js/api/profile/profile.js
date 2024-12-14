document.addEventListener("DOMContentLoaded", () => {
    const profileForm = document.getElementById("profile-form");
    const successMessage = document.getElementById("successMessage");
    const errorMessage = document.getElementById("errorMessage");
  
    if (profileForm) {
      profileForm.addEventListener("submit", async (event) => {
        event.preventDefault();
  
        // Clear previous messages
        successMessage.textContent = "";
        errorMessage.textContent = "";
        successMessage.classList.add("hidden");
        errorMessage.classList.add("hidden");
  
        // Collect form data
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const bio = document.getElementById("bio").value.trim();
  
        try {
          // Simulate a request to update the profile (replace with API call)
          console.log({ name, email, bio });
          // Simulate success
          successMessage.textContent = "Profile updated successfully!";
          successMessage.classList.remove("hidden");
        } catch (error) {
          // Display error message
          errorMessage.textContent = "Failed to update profile. Please try again.";
          errorMessage.classList.remove("hidden");
        }
      });
    }
});

if (!name || !email) {
    errorMessage.textContent = "All fields are required.";
    errorMessage.classList.remove("hidden");
    return;
  }
  
  if (!/^[a-zA-Z ]+$/.test(name)) {
    errorMessage.textContent = "Name can only contain letters and spaces.";
    errorMessage.classList.remove("hidden");
    return;
  }
  
  if (!/^[\w.-]+@(stud\.)?noroff\.no$/.test(email)) {
    errorMessage.textContent = "Please enter a valid Noroff email.";
    errorMessage.classList.remove("hidden");
    return;
}
  

const username = localStorage.getItem("username");
const accessToken = localStorage.getItem("accessToken");

if (!username || !accessToken) {
  console.error("No valid profile found in localStorage. Redirecting to login.");
  window.location.href = "/auth/login/index.html"; // Redirect to login page
} else {
  console.log(`Using existing profile: ${username}`);
}

const fetchProfile = async () => {
    const username = localStorage.getItem("username");
    const accessToken = localStorage.getItem("accessToken");
  
    try {
      const response = await fetch(`https://api.noroff.dev/v2/auction/profiles/${synthia}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch profile details.");
      }
  
      const profile = await response.json();
  
      // Populate the profile page
      document.getElementById("username").textContent = profile.name;
      document.getElementById("credits").textContent = profile.credits;
      document.getElementById("user-avatar").src = profile.avatar || "/images/default-avatar.png";
  
      console.log("Profile details loaded:", profile);
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };
  
  document.addEventListener("DOMContentLoaded", fetchProfile);
  