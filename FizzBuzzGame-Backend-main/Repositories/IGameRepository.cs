public interface IGameRepository
{
    Task<IEnumerable<Game>> GetAllGamesAsync();
    Task<Game> GetGameByNameAsync(string gameName);
    Task<Game> GetGameByIdAsync(int id);
    Task AddGameAsync(Game game);
    Task DeleteGameAsync(Game game);
}
