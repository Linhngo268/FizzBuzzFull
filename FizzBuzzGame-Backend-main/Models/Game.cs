using System.ComponentModel.DataAnnotations.Schema;

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
