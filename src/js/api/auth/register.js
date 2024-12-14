// Import the necessary API endpoint from constants.js
import { API_AUTH_REGISTER } from "../constants.js";

/**
 * Function to register a new user.
 * @param {string} name - The user's name.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Object} - The response data from the API if successful.
 * @throws {Error} - An error with a message if registration fails.
 */
export const registerUser = async (name, email, password) => {
  const response = await fetch(API_AUTH_REGISTER, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Unable to register user.");
  }

  return await response.json();
};

// Event listener for form submission
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  if (!form) {
    console.error("Form with id 'registerForm' not found.");
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Clear previous messages
    const errorMessages = document.getElementById("errorMessages");
    const successMessages = document.getElementById("successMessages");
    errorMessages.innerText = "";
    successMessages.innerText = "";

    // Retrieve form data
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Basic validation
    if (!name || !email || !password) {
      errorMessages.innerText = "All fields are required.";
      return;
    }

    try {
      // Attempt to register the user
      const responseData = await registerUser(name, email, password);

      // Save the username to localStorage for future use
      localStorage.setItem("username", name);

      // Display success message and redirect
      successMessages.innerText = "User registered successfully!";
      setTimeout(() => (window.location.href = "/auth/login/index.html"), 800);
    } catch (error) {
      errorMessages.innerText = `Error: ${error.message}`;
    }
  });
});
