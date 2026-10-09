```javascript
const noteText = document.getElementById("note-text");
const charCount = document.getElementById("char-count");
const wordCount = document.getElementById("word-count");
const clearBtn = document.getElementById("clear-btn");
const themeToggle = document.getElementById("theme-toggle");

function updateCounts() {
    const text = noteText.value;
    const characters = text.length;
    const words = text.trim() === ""
        ? 0
        : text.trim().split(/\s+/).length;

    charCount.textContent = `${characters} / 200 characters`;
    wordCount.textContent = `${words} words`;

    charCount.classList.remove("warning", "over");

    if (characters > 200) {
        charCount.classList.add("over");
    } else if (characters > 180) {
        charCount.classList.add("warning");
    }
}

function saveDraft() {
    localStorage.setItem("noteDraft", noteText.value);
}

function clearNote() {
    noteText.value = "";
    updateCounts();
    localStorage.removeItem("noteDraft");
}

function updateThemeLabel() {
    if (document.body.classList.contains("dark")) {
        themeToggle.textContent = "Light mode";
    } else {
        themeToggle.textContent = "Dark mode";
    }
}

// Restore the saved draft when the page loads.
const savedDraft = localStorage.getItem("noteDraft");

if (savedDraft !== null) {
    noteText.value = savedDraft;
}

// Restore the saved theme.
const savedTheme = localStorage.getItem("noteTheme");

if (savedTheme === "dark") {
    document.body.classList.add("dark");
}

updateThemeLabel();
updateCounts();

// Update counters and save the draft whenever the user types.
noteText.addEventListener("input", function () {
    updateCounts();
    saveDraft();
});

// Clear the note when the Clear button is clicked.
clearBtn.addEventListener("click", clearNote);

// Clear the note when Escape is pressed inside the textarea.
noteText.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        clearNote();
    }
});

// Toggle the theme and remember the user's choice.
themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark");

    const currentTheme = document.body.classList.contains("dark")
        ? "dark"
        : "light";

    localStorage.setItem("noteTheme", currentTheme);
    updateThemeLabel();
});
```
