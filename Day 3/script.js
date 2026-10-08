let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];

function searchNotes(word) {
  return notes.filter((note) =>
    note.text.toLowerCase().includes(word.toLowerCase()),
  );
}

console.log("Search result:", searchNotes("day"));

function longestNote() {
  if (notes.length === 0) {
    return null;
  }

  return notes.reduce((longest, note) =>
    note.text.length > longest.text.length ? note : longest,
  );
}

console.log("Longest note:", longestNote());
function countByCategory() {
  let counts = {
    personal: 0,
    work: 0,
    study: 0,
  };
  notes.forEach((note) => {
    counts[note.category]++;
  });
  return counts;
}
console.log("Categories:", countByCategory());
function getSummary() {
  let counts = countByCategory();
  return `${notes.length} notes: ${counts.personal} personal, ${counts.work} work, ${counts.study} study.`;
}
console.log("Summary:", getSummary());
function isDuplicate(text) {
  let cleanedText = text.trim().replace(/\s+/g, " ").toLowerCase();

  return notes.some((note) => {
    let existingText = note.text.trim().replace(/\s+/g, " ").toLowerCase();

    return existingText === cleanedText;
  });
}
console.log("Duplicate:", isDuplicate("  Buy   milk and bread  "));
function addNote(text, category) {
  if (text.length < 1 || text.length > 200) {
    console.log("Note must be between 1 and 200 characters.");
    return false;
  }

  if (isDuplicate(text)) {
    console.log("Note is a duplicate.");
    return false;
  }

  if (!["personal", "work", "study"].includes(category)) {
    console.log("Invalid category.");
    return false;
  }

  let newNote = {
    id: notes.length + 1,
    text: text,
    category: category,
  };

  notes.push(newNote);

  console.log("Note added successfully.");
  return true;
}

console.log("Add valid note:", addNote("Study DOM manipulation", "study"));
console.log("Add duplicate:", addNote("Buy milk and bread", "personal"));
console.log("Add invalid category:", addNote("Go to the gym", "fitness"));
console.log();
console.log("Add empty note:", addNote("", "personal"));
