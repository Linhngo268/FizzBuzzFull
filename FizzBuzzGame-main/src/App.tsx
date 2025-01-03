import React, { useState, useEffect } from "react";
import "./App.css";

const App: React.FC = () => {
  const [customGames, setCustomGames] = useState<any[]>([]);
  const [selectedGame, setSelectedGame] = useState<any | null>(null);
  const [numbers, setNumbers] = useState<{ number: number; userAnswer?: string }[]>([]);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [timeLeft, setTimeLeft] = useState<number>(10);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameEnded, setGameEnded] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  // const [isCollapsed, setIsCollapsed] = useState(true);

  const [newGame, setNewGame] = useState({
    
    gameName: "",
    author: "",
    rules: [{ divisor: 7, word: "Foo" }],
    range: { min: 1, max: 100 },
    timer: 60, // Default timer value
  });

  useEffect(() => {
    fetchGames();
  }, []);

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !gameEnded) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameEnded) {
      endRound();
    }
  }, [timeLeft, gameStarted, gameEnded]);

  const fetchGames = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/Games");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCustomGames(data);
      console.log("Fetched games data:", data);
    } catch (error) {
      console.error("Error fetching games:", error);
      alert("Failed to load games. Please try again later.");
    }
  };
  
  

  const handleNewGameChange = (field: string, value: any) => {
    setNewGame((prev) => ({ ...prev, [field]: value }));
  };

  const addRule = () => {
    setNewGame((prev) => ({
      ...prev,
      rules: [...prev.rules, { divisor: 1, word: "" }],
    }));
  };

  const handleRuleChange = (index: number, field: string, value: any) => {
    setNewGame((prev) => {
      const rules = [...prev.rules];
      rules[index] = { ...rules[index], [field]: value };
      return { ...prev, rules };
    });
  };

  const createGame = async () => {
    const payload = {
      gameName: newGame.gameName.trim(),
      author: newGame.author.trim(),
      minRange: newGame.range.min,
      maxRange: newGame.range.max,
      timer: newGame.timer || 60,
      rules: newGame.rules.map((rule) => ({
        divisor: Number(rule.divisor),
        word: rule.word.trim(),
      })),
    };
    
    try {
      const response = await fetch("http://localhost:5001/api/Games/create-game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || "Error creating game");
      }

      alert("Game created successfully!");
      fetchGames();
    } catch (error) {
      console.error("Error creating game:", error);
      alert("Unable to create game. Please check your input and try again.");
    }
  };

  const startGame = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/Games/play-game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameName: selectedGame.gameName }),
      });

      const data = await response.json();
      setNumbers([{ number: data.number, userAnswer: "" }]);
      setGameStarted(true);
      setGameEnded(false);
      setScore({ correct: 0, incorrect: 0 });
      setTimeLeft(selectedGame.timer || 60);
    } catch (error) {
      console.error("Error starting game:", error);
      alert("Failed to start the game. Please try again.");
    }
  };

  const submitAnswer = async () => {
    if (!numbers[0]?.userAnswer) return;
    try {
      const response = await fetch("http://localhost:5001/api/Games/validate-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameName: selectedGame.gameName,
          number: numbers[0].number,
          answer: numbers[0].userAnswer,
        }),
      });
      const data = await response.json();
      if (data.correct) {
        setScore((prev) => ({ ...prev, correct: prev.correct + 1 }));
        alert("Correct!");
      } else {
        setScore((prev) => ({ ...prev, incorrect: prev.incorrect + 1 }));
        alert(`Incorrect! The correct answer was ${data.expected}`);
      }
      fetchNextNumber();
    } catch (error) {
      console.error("Error submitting answer:", error);
      alert("Failed to submit answer. Please try again.");
    }
  };

  const fetchNextNumber = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/Games/play-game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameName: selectedGame.gameName }),
      });
      const data = await response.json();
      setNumbers([{ number: data.number, userAnswer: "" }]);
    } catch (error) {
      console.error("Error fetching next number:", error);
      alert("Failed to fetch the next number. Please try again.");
    }
  };

  const endRound = () => {
    setGameEnded(true);
    setGameStarted(false);
    setNumbers([]);
    alert(`Game Over! Correct: ${score.correct}, Incorrect: ${score.incorrect}`);
  };

 // Assuming you have a game ID that you want to delete
 const deleteGame = async (gameId: number | undefined) => {
  try {
    if (!gameId) {
      throw new Error("Game ID is missing. Please check the backend response.");
    }

    const response = await fetch(`http://localhost:5001/api/Games/${gameId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      console.log("Game deleted successfully");
      fetchGames();
    } else {
      console.log("Failed to delete game");
      const errorData = await response.json();
      console.error(errorData);
    }
  } catch (error) {
    console.error("Error deleting game:", error);
  }
};



  

  return (
    <div>
      <h1>FizzBuzz Game</h1>

       {/* Button to toggle collapse */}
       <button onClick={() => setIsCollapsed(!isCollapsed)}>
        {isCollapsed ? "Create new Game" : "Close create new game tab"}
      </button>

      {/* Conditionally render the form based on isCollapsed */}
      {!isCollapsed && (
        <div>
          <h2>Create a New Game</h2>
          <input
            type="text"
            placeholder="Game Name"
            value={newGame.gameName}
            onChange={(e) => handleNewGameChange("gameName", e.target.value)}
          />
          <input
            type="text"
            placeholder="Author"
            value={newGame.author}
            onChange={(e) => handleNewGameChange("author", e.target.value)}
          />
          <div>
            <h3>Rules</h3>
            {newGame.rules.map((rule, index) => (
              <div key={index}>
                <input
                  type="number"
                  placeholder="Divisor"
                  value={rule.divisor}
                  onChange={(e) =>
                    handleRuleChange(index, "divisor", Number(e.target.value))
                  }
                />
                <input
                  type="text"
                  placeholder="Word"
                  value={rule.word}
                  onChange={(e) =>
                    handleRuleChange(index, "word", e.target.value)
                  }
                />
              </div>
            ))}
            <button onClick={addRule}>Add Rule</button>
          </div>
          <div>
            <h3>Number Range</h3>
            <input
              type="number"
              placeholder="Min"
              value={newGame.range.min}
              onChange={(e) =>
                handleNewGameChange("range", {
                  ...newGame.range,
                  min: Number(e.target.value),
                })
              }
            />
            <input
              type="number"
              placeholder="Max"
              value={newGame.range.max}
              onChange={(e) =>
                handleNewGameChange("range", {
                  ...newGame.range,
                  max: Number(e.target.value),
                })
              }
            />
          </div>
          <div>
            <h3>Set Timer (seconds)</h3>
            <input
              type="number"
              placeholder="Timer"
              value={newGame.timer}
              onChange={(e) =>
                handleNewGameChange("timer", Number(e.target.value))
              }
            />
          </div>
          <button onClick={createGame}>Create Game</button>
        </div>
            )}
            <button onClick={() => setIsCollapsed(!isCollapsed)}>
        {isCollapsed ? "See Available games" : "Collapse"}
      </button>
      {!isCollapsed && (
              <div>
      <h2>Available Games</h2>
      <ul>
      {customGames.map((game) => (
    <li key={game.id || game._id || game.gameId}> {/* Use the correct key */}
      {game.gameName} by {game.author}{" "}
      <button onClick={() => setSelectedGame(game)}>Select Game</button>{" "}
      <button onClick={() => deleteGame(game.id || game._id || game.gameId)}>Delete</button>
    </li>
  ))}
      </ul>
    </div>
      )}

    {selectedGame && !gameStarted && (
  <div>
    <h2>Selected Game: {selectedGame.gameName}</h2>
    <p>Author: {selectedGame.author}</p>
    <p>Range: {selectedGame.range.min} to {selectedGame.range.max}</p>
    <p>
      Timer:{" "}
      <input
        type="number"
        value={selectedGame.timer || 60}
        onChange={(e) =>
          setSelectedGame({ ...selectedGame, timer: Number(e.target.value) })
        }
        placeholder="Set Timer (seconds)"
      />
    </p>
    <h3>Rules:</h3>
    <ul>
      {selectedGame.rules.map((rule: any, index: number) => (
        <li key={index}>
          If divisible by {rule.divisor}, say "{rule.word}"
        </li>
      ))}
    </ul>
    <button onClick={startGame}>Start Game</button>
    <button onClick={() => setSelectedGame(null)}>Close</button> {/* Close Button */}
  </div>
)}

    {gameStarted && !gameEnded && (
      <div>
        <h2>Playing: {selectedGame.gameName}</h2>
        <p>Time Left: {timeLeft} seconds</p>
        <p>
          Number: {numbers[0]?.number}{" "}
          <input
            type="text"
            placeholder="Your Answer"
            value={numbers[0]?.userAnswer || ""}
            onChange={(e) => setNumbers([{ ...numbers[0], userAnswer: e.target.value }])}
          />
        </p>
        <button onClick={submitAnswer}>Submit Answer</button>
        <button onClick={() => { setGameStarted(false); setNumbers([]); setTimeLeft(10); }}>Close</button> {/* Close Button */}
      </div>
    )}

    {gameEnded && (
      <div>
        <h2>Game Over!</h2>
        <p>Correct: {score.correct}</p>
        <p>Incorrect: {score.incorrect}</p>
        <button onClick={() => { setGameEnded(false); setSelectedGame(null); setScore({ correct: 0, incorrect: 0 }); setTimeLeft(10); }}>Back to Menu</button> {/* Close Button */}
      </div>
    )}
  </div>
);
 
};

export default App;
