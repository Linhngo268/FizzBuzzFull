 
"use client";
import React, { useState, useEffect } from "react";
import styles from "../styles/index.module.css";
import { Game } from "./types";

interface GamePlayProps {
  selectedGame: Game | null;
  onGameEnd: () => void;
  // submitAnswer: () => Promise<void>;
  submitAnswer: (answer: string) => Promise<void>;
  endRound: () => void;
  timeLeft: number;
  gameEnded: boolean;
  score: { correct: number; incorrect: number };
  numbers:any;
}


export default function GamePlay({
  selectedGame,
  onGameEnd,
  submitAnswer,
  
  
  
  
   
}: GamePlayProps) {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [feedback, setFeedback] = useState<{ correct: boolean; correctAnswer: string } | null>(null);
  const [timeLeft, setTimeLeft] = useState(60); // Example: 60 seconds timer
  const [gameEnded, setGameEnded] = useState(false);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 }); 

  
   
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      endRound();
    }
  }, [timeLeft]);
  useEffect(() => {
    if (timeLeft === 0) {
      endRound();
    }
  }, [timeLeft]);
  const endRound = () => {
    console.log("endRound function triggered!");   
    setGameEnded(true);   
  };
  const startGame = () => {
    if (!selectedGame) return;
    setGameStarted(true);
    generateNumber();
  };

  const generateNumber = () => {
    setFeedback(null);
    const newNumber = Math.floor(Math.random() * 100) + 1;
    setCurrentNumber(newNumber);
    setUserAnswer("");
  };

  const handleSubmitAnswer = () => {
    if (!selectedGame || currentNumber === null) return;
  
    const correctResponse =
      selectedGame.rules.find((rule) => currentNumber % rule.divisor === 0)?.word ||
      currentNumber.toString();
  
    const isCorrect = userAnswer.trim().toLowerCase() === correctResponse.toLowerCase();
  
    setFeedback({ correct: isCorrect, correctAnswer: correctResponse });
  
    
    setScore((prevScore) => ({
      correct: isCorrect ? prevScore.correct + 1 : prevScore.correct,
      incorrect: isCorrect ? prevScore.incorrect : prevScore.incorrect + 1,
    }));
  
    if (typeof submitAnswer === "function") {
      submitAnswer(userAnswer); 
    } else {
      console.error("submitAnswer is not a function");
    }
  
    setTimeout(() => generateNumber(), 1500);
  };
  
  


  return (
    <div>
      {/* Game Details */}
      {selectedGame && !gameStarted && (
        <div className={styles.selectedGameDetails}>
          <h2>Selected Game: {selectedGame.gameName}</h2>
          <p>Author: {selectedGame.author}</p>
          <p>Range: {selectedGame.range?.min} to {selectedGame.range?.max}</p>
          <p>Timer: {selectedGame.timer} seconds</p>

          <h3>Rules:</h3>
          <ul>
            {selectedGame.rules?.map((rule, index) => (
              <li key={index}>
                If divisible by {rule.divisor}, say "{rule.word}"
              </li>
            ))}
          </ul>
          <button className={styles.button} onClick={startGame}>Start Game</button>
        </div>
      )}

      {/* Active Game */}
      {gameStarted && !gameEnded && (
        <div className={styles.gamePlaySection}>
          <h2>Playing: {selectedGame?.gameName}</h2>
          <p>Time Left: {timeLeft} seconds</p>
          <p>Number: {currentNumber}</p>

          <input
            className={styles.inputField}
            type="text"
            placeholder="Your Answer"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            disabled={feedback !== null}
          />
          <button className={styles.button} onClick={handleSubmitAnswer} disabled={feedback !== null}>
            Submit Answer
          </button>

          {/* Feedback */}
          {feedback && (
            <p className={feedback.correct ? styles.correctAnswer : styles.incorrectAnswer}>
            {feedback.correct ? "Correct!" : `Incorrect! The correct answer was: ${feedback.correctAnswer}`}
          </p>
          
          )}

          <button className={styles.closeButton} onClick={endRound}>
            End Game
          </button>
        </div>
      )}

      {/* Game Over */}
      {gameEnded && (
        <div className={styles.gameOverSection}>
          <h2>Game Over!</h2>
          <p>Correct: {score.correct}</p>
          <p>Incorrect: {score.incorrect}</p>
          <button
        className={styles.button}
        onClick={() => {
          setGameStarted(false); // Reset game state
          setGameEnded(false); // Ensure game over screen resets
          onGameEnd(); // Notify parent component
        }}
      >
        Back to Menu
      </button>
        </div>
      )}
    </div>
  );
} 
