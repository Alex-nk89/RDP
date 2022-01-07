using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using RealtimeDataPortal.Models;

namespace RealtimeDataPortal
{
    public class RDPContext : DbContext
    {
        public RDPContext()
        {

        }

        public RDPContext(DbContextOptions<RDPContext> options) : base(options)
        {
        
        }

        public virtual DbSet<Access> Access { get; set; } = null!;
        public virtual DbSet<TreesMenu> TreesMenu { get; set; } = null!;
        public virtual DbSet<ExternalPages> ExternalPages { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("Server=(localdb)\\MSSQLLocalDB;Database=RDP_Base;Trusted_Connection=True;");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Access>(entity =>
            {
                entity.HasKey("Id");
            });

            modelBuilder.Entity<TreesMenu>(entity =>
            {
                entity.HasKey("Id");
            });

            modelBuilder.Entity<ExternalPages>(entity =>
            {
                entity.HasKey("Id");
            });
        }



    }
}
