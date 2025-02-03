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

  // **New states for UI toggling**
  const [showCreateGame, setShowCreateGame] = useState(false);
  const [showAvailableGames, setShowAvailableGames] = useState(false);

  const [newGame, setNewGame] = useState({
    gameName: "",
    author: "",
    rules: [{ divisor: 7, word: "Foo" }],
    range: { min: 1, max: 100 },
    timer: 60,
  });

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/Games");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCustomGames(data);
    } catch (error) {
      console.error("Error fetching games:", error);
      alert("Failed to load games. Please try again later.");
    }
  };

  const handleNewGameChange = (field: string, value: any) => {
    setNewGame((prev) => ({ ...prev, [field]: value }));
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
        throw new Error("Error creating game");
      }

      alert("Game created successfully!");
      fetchGames();
      setShowCreateGame(false); // Close the form after creation
    } catch (error) {
      console.error("Error creating game:", error);
      alert("Unable to create game. Please check your input and try again.");
    }
  };

  const deleteGame = async (gameId: number | undefined) => {
    try {
      if (!gameId) {
        throw new Error("Game ID is missing.");
      }

      const response = await fetch(`http://localhost:5001/api/Games/${gameId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("Game deleted successfully");
        fetchGames();
      } else {
        console.error("Failed to delete game");
      }
    } catch (error) {
      console.error("Error deleting game:", error);
    }
  };

  return (
    <div>
      <h1>FizzBuzz Game</h1>

      {/* Toggle buttons for different sections */}
      <button onClick={() => {
        setShowCreateGame(true);
        setShowAvailableGames(false);
      }}>
        Create New Game
      </button>

      <button onClick={() => {
        setShowAvailableGames(true);
        setShowCreateGame(false);
      }}>
        See Available Games
      </button>

      {/* Create Game Form (Visible when showCreateGame is true) */}
      {showCreateGame && (
        <div>
          <h2>Create a New Game</h2>
          <input type="text" placeholder="Game Name" value={newGame.gameName} onChange={(e) => handleNewGameChange("gameName", e.target.value)} />
          <input type="text" placeholder="Author" value={newGame.author} onChange={(e) => handleNewGameChange("author", e.target.value)} />
          
          <h3>Rules</h3>
          {newGame.rules.map((rule, index) => (
            <div key={index}>
              <input type="number" placeholder="Divisor" value={rule.divisor} onChange={(e) => handleNewGameChange("rules", [...newGame.rules])} />
              <input type="text" placeholder="Word" value={rule.word} onChange={(e) => handleNewGameChange("rules", [...newGame.rules])} />
            </div>
          ))}
          
          <h3>Number Range</h3>
          <input type="number" placeholder="Min" value={newGame.range.min} onChange={(e) => handleNewGameChange("range", { ...newGame.range, min: Number(e.target.value) })} />
          <input type="number" placeholder="Max" value={newGame.range.max} onChange={(e) => handleNewGameChange("range", { ...newGame.range, max: Number(e.target.value) })} />

          <h3>Set Timer (seconds)</h3>
          <input type="number" placeholder="Timer" value={newGame.timer} onChange={(e) => handleNewGameChange("timer", Number(e.target.value))} />
          
          <button onClick={createGame}>Create Game</button>
          <button onClick={() => setShowCreateGame(false)}>Close</button>
        </div>
      )}

      {/* Available Games (Visible when showAvailableGames is true) */}
      {showAvailableGames && (
        <div>
          <h2>Available Games</h2>
          <ul>
            {customGames.map((game) => (
              <li key={game.id || game.gameId}>
                {game.gameName} by {game.author}{" "}
                <button onClick={() => setSelectedGame(game)}>Select Game</button>
                <button onClick={() => deleteGame(game.id || game.gameId)}>Delete</button>
              </li>
            ))}
          </ul>
          <button onClick={() => setShowAvailableGames(false)}>Close</button>
        </div>
      )}

      {/* Selected Game Details */}
      {selectedGame && !gameStarted && (
        <div>
          <h2>Selected Game: {selectedGame.gameName}</h2>
          <p>Author: {selectedGame.author}</p>
          <p>Range: {selectedGame.range.min} to {selectedGame.range.max}</p>
          <p>Timer: {selectedGame.timer} seconds</p>

          <h3>Rules:</h3>
          <ul>
            {selectedGame.rules.map((rule: any, index: number) => (
              <li key={index}>
                If divisible by {rule.divisor}, say "{rule.word}"
              </li>
            ))}
          </ul>
          <button onClick={() => setSelectedGame(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default App;
