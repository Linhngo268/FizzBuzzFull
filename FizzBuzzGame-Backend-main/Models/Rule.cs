using System.ComponentModel.DataAnnotations.Schema;

public class Rule
{
    public int Id { get; set; }
    public int GameId { get; set; }
    public int Divisor { get; set; }
    public required string Word { get; set; }

    
}
