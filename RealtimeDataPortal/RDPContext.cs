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
        public virtual DbSet<AccessToComponent> AccessToComponent { get; set; } = null!;
        public virtual DbSet<Graphics> Graphics { get; set; } = null!;
        public virtual DbSet<Products> Products { get; set; } = null!;
        public virtual DbSet<ProductsParameters> ProductsParameters { get; set; } = null!;
        public virtual DbSet<ProductParameterGroups> ProductParameterGroups { get; set; } = null!;
        public virtual DbSet<Server> Server { get; set; } = null!;
        public virtual DbSet<Tags> Tags { get; set; } = null!;
        public virtual DbSet<TagsParameter> TagsParameter { get; set; } = null!;
        public virtual DbSet<TagsType> TagsType { get; set; } = null!;
        public virtual DbSet<rt_Tables> rt_Tables { get; set; } = null!;
        public virtual DbSet<rt_Sections> rt_Sections { get; set;} = null!;
        public virtual DbSet<rt_SectionProduct> rt_SectionProduct { get; set;} = null!;

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

            modelBuilder.Entity<AccessToComponent>(entity =>
            {
                entity.HasKey("Id");
            });

            modelBuilder.Entity<Graphics>(entity =>
            {
                entity.HasKey("ComponentId");
            });

            modelBuilder.Entity<Products>(entity =>
            {
                entity.HasKey("ProductId");
            });

            modelBuilder.Entity<ProductsParameters>(entity =>
            {
                entity.HasKey("ProductsParametersId");
            });

            modelBuilder.Entity<Server>(entity =>
            {
                entity.HasKey("ServerId");
            });

            modelBuilder.Entity<Tags>(entity =>
            {
                entity.HasKey("TagId");
            });

            modelBuilder.Entity<TagsParameter>(entity =>
            {
                entity.HasKey("TagParameterId");
            });

            modelBuilder.Entity<TagsType>(entity =>
            {
                entity.HasKey("TagTypeId");
            });

            modelBuilder.Entity<ProductParameterGroups>(entity =>
            {
                entity.HasKey("ProductParameterGroupsId");
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
