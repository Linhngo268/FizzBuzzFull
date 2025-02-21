public static class GameMapper
{
    public static GameDto ToDto(this Game game)
    {
        return new GameDto
        {
            Id = game.Id,
            GameName = game.GameName,
            Author = game.Author,
            Timer = game.Timer,
            MinRange = game.MinRange,
            MaxRange = game.MaxRange,
            Rules = game.Rules.Select(r => r.ToDto()).ToList()
        };
    }

    public static RuleDto ToDto(this Rule rule)
    {
        return new RuleDto
        {
            Divisor = rule.Divisor,
            Word = rule.Word
        };
    }
}
