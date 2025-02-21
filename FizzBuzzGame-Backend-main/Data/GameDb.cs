// using System.ComponentModel.DataAnnotations.Schema;
// using Microsoft.EntityFrameworkCore;

// public class GameDbContext(DbContextOptions<GameDbContext> options) : DbContext(options)
// {
//     public required DbSet<Game> Games { get; set; }
//     public required DbSet<Rule> Rules { get; set; }
   
// }
 using Microsoft.EntityFrameworkCore;

public class GameDbContext : DbContext
{
    public GameDbContext(DbContextOptions<GameDbContext> options) : base(options) { }

    public required DbSet<Game> Games { get; set; }
    public required DbSet<Rule> Rules { get; set; }
}
