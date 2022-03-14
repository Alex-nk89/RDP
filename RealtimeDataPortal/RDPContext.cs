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

        public virtual DbSet<AccessProfiles> AccessProfiles { get; set; } = null!;
        public virtual DbSet<TreesMenu> TreesMenu { get; set; } = null!;
        public virtual DbSet<ExternalPages> ExternalPages { get; set; } = null!;
        public virtual DbSet<AccessToComponent> AccessToComponent { get; set; } = null!;
        public virtual DbSet<Products> Products { get; set; } = null!;
        public virtual DbSet<Parameter> Parameter { get; set; } = null!;
        public virtual DbSet<ParameterTag> ParameterTag { get; set; } = null!;
        public virtual DbSet<Server> Server { get; set; } = null!;
        public virtual DbSet<Tag> Tag { get; set; } = null!;
        public virtual DbSet<ParameterType> ParameterType { get; set; } = null!;
        public virtual DbSet<TagsType> TagsType { get; set; } = null!;
        public virtual DbSet<rt_Tables> rt_Tables { get; set; } = null!;
        public virtual DbSet<rt_Sections> rt_Sections { get; set;} = null!;
        public virtual DbSet<rt_SectionProduct> rt_SectionProduct { get; set;} = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            //optionsBuilder.UseSqlServer("Server=(localdb)\\MSSQLLocalDB;Database=RDP_Base;Trusted_Connection=True;");
            optionsBuilder.UseSqlServer("Server=asodu-app;Database=RealtimeDataPortal;User Id=RTDPortalUser;Password=G8inDMs27b");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AccessProfiles>(entity =>
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

            modelBuilder.Entity<AccessToComponent>(entity =>
            {
                entity.HasKey("Id");
            });

            modelBuilder.Entity<Products>(entity =>
            {
                entity.HasKey("ProductId");
            });

            modelBuilder.Entity<Parameter>(entity =>
            {
                entity.HasKey("ParameterId");
            });

            modelBuilder.Entity<Server>(entity =>
            {
                entity.HasKey("ServerId");
            });

            modelBuilder.Entity<Tag>(entity =>
            {
                entity.HasKey("TagId");
            });

            modelBuilder.Entity<ParameterType>(entity =>
            {
                entity.HasKey("ParameterTypeId");
            });

            modelBuilder.Entity<TagsType>(entity =>
            {
                entity.HasKey("TagTypeId");
            });

            modelBuilder.Entity<ParameterTag>(entity =>
            {
                entity.HasKey("ParameterTagId");
            });

            modelBuilder.Entity<rt_Tables>(entity =>
            {
                entity.HasKey("TableId");
            });

            modelBuilder.Entity<rt_Sections>(entity =>
            {
                entity.HasKey("SectionId");
            });

            modelBuilder.Entity<rt_SectionProduct>(entity =>
            {
                entity.HasKey("Id");
            });
        }



    }
}
