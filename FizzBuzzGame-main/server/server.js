const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory storage for games
let customGames = {};

// Helper function to apply game rules
const applyGameRules = (number, rules) => {
  let result = "";

  rules.forEach((rule) => {
    if (number % rule.divisor === 0) {
      result += rule.word;
    }
  });

  return result || number.toString();
};

// Helper function to validate user answers
const validateAnswer = (number, answer, rules) => {
  let correctAnswer = applyGameRules(number, rules);
  return correctAnswer.toLowerCase() === answer.toLowerCase();
};

// Routes
// Create a new custom game
app.post("/create-game", (req, res) => {
  const { gameName, author, rules, range } = req.body;

  if (!gameName || !author || !rules || !range) {
    return res.status(400).json({ error: "Missing required fields." });
  }
  if (customGames[gameName]) {
    return res.status(400).json({ error: "Game name already exists." });
  }
  if (range.min < 0 || range.max < 0) {
    return res.status(400).json({ error: "Negative numbers are not allowed." });
  }

  customGames[gameName] = {
    author,
    rules,
    range,
  };

  res.json({ message: "Game created successfully.", gameName });
});

// Fetch all custom games
app.get("/games", (req, res) => {
  res.json(customGames);
});

// Play a custom game
// Play a custom game (get a random number within range)
app.post("/play-game", (req, res) => {
    const { gameName } = req.body;
  
    if (!gameName || !customGames[gameName]) {
      return res.status(400).json({ error: "Invalid game name." });
    }
  
    const game = customGames[gameName];
    const { range } = game;
  
    const randomNumber = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
  
    res.json({ gameName, number: randomNumber });
  });
  
  // Validate user answer for a specific number
  app.post("/validate-answer", (req, res) => {
    const { gameName, number, answer } = req.body;
  
    if (!gameName || !customGames[gameName]) {
      return res.status(400).json({ error: "Invalid game name." });
    }
  
    const game = customGames[gameName];
    const { rules } = game;
  
    if (validateAnswer(number, answer, rules)) {
      return res.json({ correct: true });
    } else {
      return res.json({ correct: false, expected: applyGameRules(number, rules) });
    }
  });
  

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
