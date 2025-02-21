using System.ComponentModel.DataAnnotations;

public class RuleDto
{
    [Range(1, int.MaxValue, ErrorMessage = "Divisor must be a positive number.")]
    public int Divisor { get; set; }

    [Required]
    public string Word { get; set; }
}
