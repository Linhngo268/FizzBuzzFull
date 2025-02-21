using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

public class CreateGameRequest
{
    [Required]
    public string GameName { get; set; }

    [Required]
    public string Author { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "Timer must be a positive number.")]
    public int Timer { get; set; }

    public int MinRange { get; set; }
    public int MaxRange { get; set; }

    [Required]
    [MinLength(1, ErrorMessage = "At least one rule is required.")]
    public List<RuleDto> Rules { get; set; }
}
