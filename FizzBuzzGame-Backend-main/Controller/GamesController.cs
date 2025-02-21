using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class GamesController : ControllerBase
{
    private readonly IGameService _gameService;

    public GamesController(IGameService gameService)
    {
        _gameService = gameService;
    }

    [HttpGet]
    public async Task<IActionResult> GetGames()
    {
        var games = await _gameService.GetAllGamesAsync();
        return Ok(games);
    }

    [HttpGet("{gameName}")]
    public async Task<IActionResult> GetGameByName(string gameName)
    {
        var gameDto = await _gameService.GetGameByNameAsync(gameName);
        if (gameDto == null) return NotFound(new { error = "Game not found." });

        return Ok(gameDto);
    }

   [HttpPost("create-game")]
public async Task<IActionResult> CreateGame([FromBody] CreateGameRequest request)
{
    if (!ModelState.IsValid)
    {
        return BadRequest(ModelState);
    }

    if (request.Rules.Any(r => r.Divisor <= 0))
    {
        return BadRequest(new { error = "All divisors must be positive numbers." });
    }

    var newGame = new Game
    {
        GameName = request.GameName,
        Author = request.Author,
        Timer = request.Timer,
        MinRange = request.MinRange,
        MaxRange = request.MaxRange,
        Rules = request.Rules.Select(r => new Rule { Divisor = r.Divisor, Word = r.Word }).ToList()
    };

    string response = await _gameService.CreateGameAsync(newGame);
    if (response.Contains("exists")) return BadRequest(new { error = response });

    return Ok(new { message = response });
}

    [HttpPost("play-game")]
    public async Task<IActionResult> PlayGame([FromBody] PlayGameRequest request)
    {
        var (number, timeLeft) = await _gameService.PlayGameAsync(request.GameName);
        if (number == -1) return NotFound(new { error = "Game not found." });

        return Ok(new { number, timeLeft });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteGame(int id)
    {
        string response = await _gameService.DeleteGameAsync(id);
        if (response.Contains("not found")) return NotFound(new { error = response });

        return Ok(new { message = response });
    }

    [HttpPost("validate-answer")]
    public async Task<IActionResult> ValidateAnswer([FromBody] ValidateAnswerRequest request)
    {
        bool isCorrect = await _gameService.ValidateAnswerAsync(request);
        return Ok(new { correct = isCorrect });
    }
}
