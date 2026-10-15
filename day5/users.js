const userList = document.getElementById("userList");
const filterInput = document.getElementById("filterInput");
const statusMessage = document.getElementById("statusMessage");

let users = [];

async function loadUsers() {
  statusMessage.textContent = "Loading users...";

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");

    if (!response.ok) {
      throw new Error("Failed to fetch users.");
    }

    users = await response.json();

    renderUsers(users);

    statusMessage.textContent = "Loaded " + users.length + " users.";
  } catch (error) {
    statusMessage.textContent =
      "Could not load users. Please check your connection and try again.";
    console.error("Error loading users:", error);
  } finally {
    console.log("User loading process finished.");
  }
}

function renderUsers(list) {
  userList.innerHTML = "";

  if (list.length === 0) {
    const message = document.createElement("li");
    message.textContent = "No users found.";
    userList.appendChild(message);
    return;
  }

  list.forEach((user) => {
    const listItem = document.createElement("li");

    const name = document.createElement("h2");
    name.textContent = user.name;

    const email = document.createElement("p");
    email.textContent = `Email: ${user.email}`;

    const city = document.createElement("p");
    city.textContent = `City: ${user.address.city}`;

    listItem.appendChild(name);
    listItem.appendChild(email);
    listItem.appendChild(city);

    userList.appendChild(listItem);
  });
}

filterInput.addEventListener("input", () => {
  const searchTerm = filterInput.value.toLowerCase().trim();

  const filteredUsers = users.filter((user) => {
    return (
      user.name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.address.city.toLowerCase().includes(searchTerm)
    );
  });

  renderUsers(filteredUsers);
});

loadUsers();
