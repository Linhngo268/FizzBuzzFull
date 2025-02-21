
"use client";
import { useState,useEffect } from "react";
import CreateGame from "../components/CreateGame";
import AvailableGames from "../components/AvailableGame";
import GamePlay from "../components/GamePlay";
import { Game, fetchGames, deleteGame   } from "../components/types";
  

import styles from "../styles/index.module.css";


export default function Home() {
  const [games, setGames] = useState<any[]>([]);
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [numbers, setNumbers] = useState<any[]>([]);
  const [showCreateGame, setShowCreateGame] = useState(false);
  const [showAvailableGames, setShowAvailableGames] = useState(false);
  const [customGames, setCustomGames] = useState<any[]>([]);

  const [newGame, setNewGame] = useState({
        gameName: "",
        author: "",
        rules: [{ divisor: 7, word: "Foo" }],
        range: { min: 1, max: 100 },
        timer: 60,
      });
    
      useEffect(() => {
        loadGames();
      }, []);
      const loadGames = async () => {
        try {
          const games = await fetchGames();
          setCustomGames(games);
        } catch {
          alert("Failed to load games. Please try again later.");
        }
      };
      useEffect(() => {
        if (gameStarted && timeLeft > 0 && !gameEnded) {
          const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
          return () => clearTimeout(timer);
        } else if (timeLeft === 0 && !gameEnded) {
          endRound();
        }
      }, [timeLeft, gameStarted, gameEnded]);

  const addGame = (newGame: any) => {
    setGames([...games, { ...newGame, id: games.length + 1 }]);
  };
   
  const endRound = () => {
        setGameEnded(true);
        setGameStarted(false);
        setNumbers([]);
        alert(`Game Over! Correct: ${score.correct}, Incorrect: ${score.incorrect}`);
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
  
      setScore((prev) => ({
        correct: prev.correct + (data.correct ? 1 : 0),
        incorrect: prev.incorrect + (!data.correct ? 1 : 0),
      }));
  
      alert(data.correct ? "Correct!" : "Incorrect!");
  
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
   

   
          return (
            <div>
              <h1 className={styles.h1}>FizzBuzz Game</h1>
        
              <div className={styles.container}>
                <button
                  className={styles.buttonToggle}
                  onClick={() => {
                    setShowCreateGame(true);
                    setShowAvailableGames(false);
                  }}
                >
                  Create New Game
                </button>
        
                <button
                  className={styles.buttonToggle}
                  onClick={() => {
                    setShowAvailableGames(true);
                    setShowCreateGame(false);
                  }}
                >
                  See Available Games
                </button>
              </div>
        
              {/* Show Create Game Modal */}
              {showCreateGame && (
                <CreateGame addGame={addGame}   />
              )}
        
              {/* Show Available Games */}
              {showAvailableGames && (
                <AvailableGames
                  games={games}
                  selectGame={setSelectedGame}
                  deleteGame={deleteGame}
                   
                />
              )}
        
              {/* Gameplay */}
              {selectedGame && gameStarted && (
                <GamePlay
                  selectedGame={selectedGame}
                  numbers={numbers}
                  submitAnswer={submitAnswer}
                  endRound={endRound}
                  timeLeft={timeLeft}
                  gameEnded={gameEnded}
                  score={score}
                  onGameEnd={() => {}}
                />
              )}
            </div>
          );
        }