"use client";
import { useState, useEffect } from "react";
import styles from "../styles/index.module.css";
import GamePlay from "./GamePlay";
import { Game, fetchGames, deleteGame    } from "./types";
  
interface AvailableGames {
  games: any[];   
  selectGame: (game: any) => void;
  deleteGame: (id: number | undefined) => void;
   
}
 

export default function AvailableGames({ games  }: AvailableGames) {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [customGames, setCustomGames] = useState<Game[]>([]);

  
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
 

  return (
    <div>
      <h2  className={styles.h1}>Available Games</h2>
       
      {customGames.length > 0 ? (
        <ul className={styles.gameList}>
          {customGames.map((game) => (
            <li key={game.id || game.gameId}>
              {game.gameName} by {game.author}{" "}
              <button className={styles.button} onClick={() => setSelectedGame(game)}>
                Select Game
              </button>
              <button className={styles.button} onClick={() => deleteGame(game.id || game.gameId)}>
                Delete
              </button>
               

            </li>
          ))}
        </ul>
        
      ) : (
        <p>No games available.</p>
      )}

      
        {/* <GamePlay selectedGame={selectedGame} onGameEnd={() => setSelectedGame(null)} /> */}
        <GamePlay
        selectedGame={selectedGame}
        onGameEnd={() => setSelectedGame(null)}
        submitAnswer={async (answer) => console.log("Answer submitted:", answer)} 
        endRound={() => console.log("Round ended")}  
        timeLeft={60}  
        gameEnded={false} 
        score={{
          correct: 0,
          incorrect: 0
        }} numbers={undefined}/>

      
          

         
    </div>
  );
}
