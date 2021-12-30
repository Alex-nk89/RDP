﻿using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using RealtimeDataPortal.Models;

namespace RealtimeDataPortal
{
    public class RDPContext : DbContext
    {
        public RDPContext()
        {

        }

        //public RDPContext(DbContextOptions<RDPContext> options) : base(options)
        //{
        //
        //}

        public virtual DbSet<Access> Access { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("Server=(localdb)\\MSSQLLocalDB;Database=RDP_Base;Trusted_Connection=True;");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

        }



    }
}
