const loadButton = document.getElementById("load-btn");
const userList = document.getElementById("users-list");
const filterInput = document.getElementById("filter-input");
const statusMessage = document.getElementById("status");

let users = [];

async function loadUsers() {
  loadButton.disabled = true;
  statusMessage.textContent = "Loading users...";

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");

    if (!response.ok) {
      throw new Error("Failed to fetch users.");
    }

    users = await response.json();

    renderUsers(users);

    statusMessage.textContent = `Loaded ${users.length} users.`;
  } catch (error) {
    statusMessage.textContent =
      "Could not load users. Please check your connection and try again.";

    console.error("Error loading users:", error);
  } finally {
    loadButton.disabled = false;
  }
}

function renderUsers(list) {
  userList.innerHTML = "";

  if (list.length === 0) {
    const message = document.createElement("li");
    message.textContent = "No users match your filter.";
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

    const company = document.createElement("p");
    company.textContent = `Company: ${user.company.name}`;

    listItem.appendChild(name);
    listItem.appendChild(email);
    listItem.appendChild(city);
    listItem.appendChild(company);

    userList.appendChild(listItem);
  });
}

loadButton.addEventListener("click", loadUsers);

filterInput.addEventListener("input", () => {
  const searchTerm = filterInput.value.toLowerCase().trim();

  const filteredUsers = users.filter((user) => {
    return (
      user.name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.address.city.toLowerCase().includes(searchTerm) ||
      user.company.name.toLowerCase().includes(searchTerm)
    );
  });

  renderUsers(filteredUsers);
});
