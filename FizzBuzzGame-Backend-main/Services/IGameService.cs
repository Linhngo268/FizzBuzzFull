public interface IGameService
{
    Task<IEnumerable<object>> GetAllGamesAsync();
    Task<Game> GetGameByNameAsync(string gameName);
    // Task<int> PlayGameAsync(string gameName);
    Task<(int number, int timeLeft)> PlayGameAsync(string gameName);
    Task<bool> ValidateAnswerAsync(ValidateAnswerRequest request);
    Task<string> CreateGameAsync(Game newGame);
    Task<string> DeleteGameAsync(int id);
}
