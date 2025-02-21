"use client";
import { useState } from "react";

import styles from "../styles/index.module.css";
import { Game, fetchGames } from "./types";
interface CreateGameProps {
  addGame: (newGame: any) => void;
   
}
export default function CreateGame({ addGame  }: CreateGameProps) {
  const [showCreateGame, setShowCreateGame] = useState(false);
  const [customGames, setCustomGames] = useState<any[]>([]);
  const [newGame, setNewGame] = useState({
        gameName: "",
        author: "",
        rules: [{ divisor: 7, word: "Foo" }],
        range: { min: 1, max: 100 },
        timer: 60,
      });

   
  const handleNewGameChange = (field: string, value: any) => {
        setNewGame((prev: any) => ({ ...prev, [field]: value }));
      };
       
    
  const createGame = async () => {
        const payload = {
          gameName: newGame.gameName.trim(),
          author: newGame.author.trim(),
          minRange: newGame.range.min,
          maxRange: newGame.range.max,
          timer: newGame.timer || 60,
          rules: newGame.rules.map((rule: { divisor: any; word: string; }) => ({
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

  const handleRuleChange = (index: number, field: string, value: any) => {
    const updatedRules = [...newGame.rules];
    updatedRules[index] = { ...updatedRules[index], [field]: value };
    setNewGame((prev) => ({ ...prev, rules: updatedRules }));
  };
  const addRule = () => {
        setNewGame((prev) => ({
          ...prev,
          rules: [...prev.rules, { divisor: 1, word: "" }],
        }));
      };

  return (
   
    <div className={styles.createGameSection}>
      <h2  className={styles.h2}>Create a New Game</h2>
      <input className={styles.inputField} type="text" placeholder="Game Name" value={newGame.gameName} onChange={(e) => handleNewGameChange("gameName", e.target.value)} />
      <input className={styles.inputField} type="text" placeholder="Author" value={newGame.author} onChange={(e) => handleNewGameChange("author", e.target.value)} />
      
      <h3  className={styles.h2}>Rules</h3>
      {newGame.rules.map((rule, index) => (
        <div key={index} className={styles.ruleInput}>
          <input  className={styles.inputField} type="number" placeholder="Divisor" value={rule.divisor} onChange={(e) => handleRuleChange(index, "divisor", Number(e.target.value))} />
          <input  className={styles.inputField} type="text" placeholder="Word" value={rule.word} onChange={(e) => handleRuleChange(index, "word", e.target.value)} />
        </div>
      ))}
      <button className={styles.button} onClick={addRule}>Add Rule</button>
      
      <h3  className={styles.h2}>Number Range</h3>
      <input className={styles.inputField} type="number" placeholder="Min" value={newGame.range.min} onChange={(e) => handleNewGameChange("range", { ...newGame.range, min: Number(e.target.value) })} />
      <input className={styles.inputField} type="number" placeholder="Max" value={newGame.range.max} onChange={(e) => handleNewGameChange("range", { ...newGame.range, max: Number(e.target.value) })} />
      
      <h3  className={styles.h2}>Set Timer (seconds)</h3>
      <input className={styles.inputField} type="number" placeholder="Timer" value={newGame.timer} onChange={(e) => handleNewGameChange("timer", Number(e.target.value))} />
      
      <button className={styles.button} onClick={createGame}>Create Game</button>
       
    </div>
  
  );
}
