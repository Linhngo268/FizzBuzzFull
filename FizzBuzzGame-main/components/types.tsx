
export interface Game {
    id?: number;
    gameId?: number;
    gameName: string;
    author?: string;
    range?: { min: number; max: number };
    timer?: number;
    rules?: { divisor: number; word: string }[];
  }
  
  /**
   * Fetches the list of games from the API.
   * @returns {Promise<Game[]>} List of games
   */
  export const fetchGames = async (): Promise<Game[]> => {
    try {
      const response = await fetch("http://localhost:5001/api/Games");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching games:", error);
      throw error; // Allow caller to handle the error
    }
  };
  
  /**
   * Deletes a game by its ID.
   * @param {number} gameId - The ID of the game to delete
   */
  export const deleteGame = async (gameId?: number): Promise<void> => {
    try {
      if (!gameId) {
        throw new Error("Game ID is missing.");
      }
      
  
      const response = await fetch(`http://localhost:5001/api/Games/${gameId}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete game");
      }
  
      console.log("Game deleted successfully");
    } catch (error) {
      console.error("Error deleting game:", error);
      throw error; // Allow caller to handle the error
    }
  };
   