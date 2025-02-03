using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
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

    [HttpPost("create-game")]
    public async Task<IActionResult> CreateGame([FromBody] Game newGame)
    {
        string response = await _gameService.CreateGameAsync(newGame);
        if (response.Contains("exists")) return BadRequest(new { error = response });
        return Ok(new { message = response });
    }

   [HttpPost("play-game")]
public async Task<IActionResult> PlayGame([FromBody] PlayGameRequest request)
{
    int response = await _gameService.PlayGameAsync(request.GameName);
    if (response == -1) return NotFound(new { error = "Game not found." });

    return Ok(new { number = response });  
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
