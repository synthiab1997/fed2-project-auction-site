import { API_KEY } from "../../api/constants";
import { onDeletePost } from "../../ui/post/delete";
import { authGuard } from "../../utilities/authGuard";

authGuard();

async function myProfile() {
  const token = window.localStorage.getItem("token");
  const username = window.localStorage.getItem("username");

  if (!username) {
    console.error("No username provided in localStorage.");
    return;
  }

  try {
    const response = await fetch(
      `https://v2.api.noroff.dev/social/profiles/${username}/posts`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch post data");
    }

    const data = await response.json();
    displayPosts(data.data);
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}

function displayPosts(posts) {
  const postsContainer = document.getElementById("postsContainer");
  postsContainer.innerHTML = "";

  if (!posts || posts.length === 0) {
    postsContainer.innerHTML = "<p>No posts available.</p>";
    return;
  }

  posts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.innerHTML = `
      <h2>${post.title}</h2>
                  <img src="${post.media.url}" alt="${
      post.media.alt
    }" style="max-width: 100%; height: auto;">
      <p>${post.body}</p>
      <small>Posted on: ${new Date(post.created).toLocaleDateString()}</small>
      <div>
        <span>Comments: ${post._count.comments}</span>
        <span>Reactions: ${post._count.reactions}</span>
      </div>
        <div>
    <button onclick="location.href='${`/post/edit/?id=${post.id}`}'">Edit Post</button>
    <button onclick="location.href='${`/post/?id=${post.id}`}'">View Post</button>
    <button class="deleteButton" data-id="${post.id}">Delete Post</button>
  </div>
      <hr>
    `;
    const postsContainer = document.getElementById("postsContainer");
    postsContainer.addEventListener("click", (event) => {
      // Check if the clicked element has the class "deleteButton"
      if (event.target.classList.contains("deleteButton")) {
        const postId = event.target.getAttribute("data-id"); // Get the post ID
        onDeletePost(postId); // Call the onDeletePost function with the post ID
      }
    });
    postsContainer.appendChild(postElement);
  });
}

myProfile();