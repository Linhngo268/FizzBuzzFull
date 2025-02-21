using Microsoft.EntityFrameworkCore;  // Ensure this is at the top

public class GameService : IGameService
{
    private readonly IGameRepository _gameRepository;

    public GameService(IGameRepository gameRepository)
    {
        _gameRepository = gameRepository;
    }
    private readonly Dictionary<string, DateTime> _gameStartTimes = new();


    public async Task<(int number, int timeLeft)> PlayGameAsync(string gameName)
    {
        var game = await _gameRepository.GetGameByNameAsync(gameName);
        if (game == null)
            return (-1, 0); // Return -1 for number and 0 for timeLeft if game is not found.

        var random = new Random();
        int nextNumber = random.Next(game.MinRange, game.MaxRange + 1);

        // If the game hasn't started, set the start time in the dictionary
        _gameStartTimes.TryAdd(gameName, DateTime.UtcNow);

        // Get elapsed time since the game started
        _gameStartTimes.TryGetValue(gameName, out DateTime startTime);
        int timeElapsed = (int)(DateTime.UtcNow - startTime).TotalSeconds;
        int timeLeft = Math.Max(0, game.Timer - timeElapsed); // Ensure time does not go negative

        return (nextNumber, timeLeft);
    }

    // public async Task<IEnumerable<object>> GetAllGamesAsync()
    // {
    //     var games = await _gameRepository.GetAllGamesAsync();
    //     return games.Select(g => new 
    //     {
    //         g.Id,
    //         g.GameName,
    //         g.Author,
    //         g.Timer,
    //         Rules = g.Rules.Select(r => new { r.Divisor, r.Word }),
    //         Range = new { Min = g.MinRange, Max = g.MaxRange }
    //     });
    // }
    public async Task<IEnumerable<GameDto>> GetAllGamesAsync()
{
    var games = await _gameRepository.GetAllGamesAsync();
    return games.Select(g => g.ToDto());
}


    // public async Task<Game> GetGameByNameAsync(string gameName)
    // {
    //     return await _gameRepository.GetGameByNameAsync(gameName);
    // }
public async Task<GameDto> GetGameByNameAsync(string gameName)
{
    var game = await _gameRepository.GetGameByNameAsync(gameName);
    return game?.ToDto();
}






   public async Task<bool> ValidateAnswerAsync(ValidateAnswerRequest request)
{
    var game = await _gameRepository.GetGameByNameAsync(request.GameName);
    if (game == null)
        return false;

    // Generate expected answer based on divisibility rules
    string expectedAnswer = string.Join("", game.Rules
        .Where(r => request.Number % r.Divisor == 0)
        .Select(r => r.Word));

    // If no rule applies, the answer should be the number itself
    if (string.IsNullOrEmpty(expectedAnswer))
        expectedAnswer = request.Number.ToString();

    // Compare case-insensitively
    return string.Equals(expectedAnswer, request.Answer, StringComparison.OrdinalIgnoreCase);
}


    public async Task<string> CreateGameAsync(Game newGame)
    {
        if (await _gameRepository.GetGameByNameAsync(newGame.GameName) != null)
            return "Game name already exists.";

        newGame.Timer = newGame.Timer > 0 ? newGame.Timer : 60;
        await _gameRepository.AddGameAsync(newGame);
        return "Game created successfully.";
    }

    public async Task<string> DeleteGameAsync(int id)
    {
        var game = await _gameRepository.GetGameByIdAsync(id);
        if (game == null)
            return "Game not found.";

        await _gameRepository.DeleteGameAsync(game);
        return "Game deleted successfully.";
    }
}
