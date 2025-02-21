public class GameDto
{
    public int Id { get; set; }
    public string GameName { get; set; }
    public string Author { get; set; }
    public int Timer { get; set; }
    public IEnumerable<RuleDto> Rules { get; set; }
    public int MinRange { get; set; }
    public int MaxRange { get; set; }
}

