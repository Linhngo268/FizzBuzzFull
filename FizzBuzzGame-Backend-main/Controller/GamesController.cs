using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class GamesController : ControllerBase
{
    private readonly GameDbContext _context;

    public GamesController(GameDbContext context)
    {
        _context = context;
    }

    // GET: api/Games
    [HttpGet]
public async Task<ActionResult<IEnumerable<Game>>> GetGames()
{
    var games = await _context.Games.Include(g => g.Rules).ToListAsync();
    return Ok(games.Select(g => new 
    {
    g.Id,
        g.GameName,
        g.Author,
        g.Timer, // Include the timer
        Rules = g.Rules.Select(r => new { r.Divisor, r.Word }),
        Range = new { Min = g.MinRange, Max = g.MaxRange }
    }));
}


    // POST: api/Games (Create Game)
    [HttpPost("create-game")]
public async Task<ActionResult> CreateGame([FromBody] Game newGame)
{
    try
    {
        if (await _context.Games.AnyAsync(g => g.GameName == newGame.GameName))
        {
            return BadRequest(new { error = "Game name already exists." });
        }
        }
    catch (Exception ex)
    {
        return BadRequest(new { error = $"Internal error: {ex.Message}" });
    }

    // Ensure Timer is set to a default value if not provided
    newGame.Timer = newGame.Timer > 0 ? newGame.Timer : 60; // Default: 60 seconds

    _context.Games.Add(newGame);
    await _context.SaveChangesAsync();
    return Ok(new { message = "Game created successfully." });
}


    // POST: api/Games/play-game (Get next number in the game)
    [HttpPost("play-game")]
    public async Task<ActionResult> PlayGame([FromBody] PlayGameRequest request)
    {
        var game = await _context.Games.Include(g => g.Rules).FirstOrDefaultAsync(g => g.GameName == request.GameName);
        if (game == null)
        {
            return NotFound(new { error = "Game not found." });
        }

        var random = new Random();
        int nextNumber = random.Next(game.MinRange, game.MaxRange + 1);
        return Ok(new { 
            number = nextNumber,
         timer = game.Timer // Include the timer in the response 
         });
    }
// DELETE: api/Games/{id}
[HttpDelete("{id}")]
public async Task<ActionResult> DeleteGame(int id)
{
    var game = await _context.Games.Include(g => g.Rules).FirstOrDefaultAsync(g => g.Id == id);

    if (game == null)
    {
        return NotFound(new { error = "Game not found." });
    }

    // Remove associated rules first (if applicable)
    _context.Rules.RemoveRange(game.Rules);

    // Remove the game itself
    _context.Games.Remove(game);
    await _context.SaveChangesAsync();

    return Ok(new { message = "Game deleted successfully." });
}

    // POST: api/Games/validate-answer (Validate user answer)
    [HttpPost("validate-answer")]
    public async Task<ActionResult> ValidateAnswer([FromBody] ValidateAnswerRequest request)
    {
        var game = await _context.Games.Include(g => g.Rules).FirstOrDefaultAsync(g => g.GameName == request.GameName);
        if (game == null)
        {
            return NotFound(new { error = "Game not found." });
        }

        string expectedAnswer = string.Join("", game.Rules
            .Where(r => request.Number % r.Divisor == 0)
            .Select(r => r.Word));

        bool isCorrect = expectedAnswer == request.Answer;
        return Ok(new { correct = isCorrect, expected = expectedAnswer });
    }
}


