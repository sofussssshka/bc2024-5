const { Command } = require("commander");
const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const multer = require("multer"); // Ensure multer is correctly imported

const app = express();
app.use(bodyParser.json());

const program = new Command();

// Set host and port values
const host = "127.0.0.1";
const port = 3000;

// Specify the cache directory
const cache = path.join(__dirname, "cache");

if (!fs.existsSync(cache)) {
  fs.mkdirSync(cache, { recursive: true });
}

const getNotePath = (noteName) => {
  return path.join(cache, `${noteName}.txt`);
};

const fetchNote = (noteName) => {
  try {
    const notePath = getNotePath(noteName);
    return fs.existsSync(notePath) ? fs.readFileSync(notePath, "utf8") : null;
  } catch (error) {
    console.error("Error reading note:", error);
    return null;
  }
};

const saveNote = (noteName, content) => {
  try {
    const notePath = getNotePath(noteName);
    fs.writeFileSync(notePath, content, "utf8");
  } catch (error) {
    console.error("Error writing note:", error);
  }
};

// Initialize multer
const upload = multer();

// GET all notes
app.get("/notes", (req, res) => {
  const notesList = fs
    .readdirSync(cache)
    .filter((filename) => filename.endsWith(".txt"))
    .map((filename) => {
      const name = filename.replace(/\.txt$/, "");
      const text = fetchNote(name);
      return { name, text };
    });
  res.status(200).json(notesList);
});

// GET specific note
app.get("/notes/:noteName", (req, res) => {
  const content = fetchNote(req.params.noteName);
  if (!content) return res.status(404).send("Note not found");
  res.status(200).send(content);
});

// POST new note
app.post("/write", upload.none(), (req, res) => {
  const { note_name, note } = req.body;
  if (fetchNote(note_name)) return res.status(400).send("Note already exists");
  saveNote(note_name, note);
  res.status(201).send("Note successfully created");
});

// Start the server
app.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
