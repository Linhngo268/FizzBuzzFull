using Microsoft.EntityFrameworkCore;  // Ensure this is at the top

public class GameRepository : IGameRepository
{
    private readonly GameDbContext _context;

    public GameRepository(GameDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Game>> GetAllGamesAsync()
    {
        return await _context.Games.Include(g => g.Rules).ToListAsync();
    }

    public async Task<Game> GetGameByNameAsync(string gameName)
    {
        return await _context.Games.Include(g => g.Rules)
            .FirstOrDefaultAsync(g => g.GameName == gameName);
    }

    public async Task<Game> GetGameByIdAsync(int id)
    {
        return await _context.Games.Include(g => g.Rules)
            .FirstOrDefaultAsync(g => g.Id == id);
    }

    public async Task AddGameAsync(Game game)
    {
        _context.Games.Add(game);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteGameAsync(Game game)
    {
        _context.Rules.RemoveRange(game.Rules); // Remove rules first
        _context.Games.Remove(game);
        await _context.SaveChangesAsync();
    }
}
