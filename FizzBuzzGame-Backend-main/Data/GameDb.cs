using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

public class GameDbContext(DbContextOptions<GameDbContext> options) : DbContext(options)
{
    public required DbSet<Game> Games { get; set; }
    public required DbSet<Rule> Rules { get; set; }
   
}

public class Game
{
    public int Id { get; set; }
    public required string GameName { get; set; }
    public required string Author { get; set; }
    public int MinRange { get; set; }
    public int MaxRange { get; set; }
    public int Timer { get; set; } // New property to store the timer
    public required ICollection<Rule> Rules { get; set; } = new List<Rule>();
}

public class Rule
{
    public int Id { get; set; }
    public int GameId { get; set; }
    public int Divisor { get; set; }
    public string Word { get; set; }
    // Foreign key to Game
     

    // Navigation property back to Game
    // public Game Game { get; set; }
}
// Helper classes for requests
public class PlayGameRequest
{
    public string GameName { get; set; }
}

public class ValidateAnswerRequest
{
    public string GameName { get; set; }
    public int Number { get; set; }
    public string Answer { get; set; }
}

