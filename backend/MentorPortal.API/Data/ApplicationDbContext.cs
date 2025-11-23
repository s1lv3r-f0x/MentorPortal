using Microsoft.EntityFrameworkCore;
using MentorPortal.API.Models;

namespace MentorPortal.API.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<MentorEmployee> MentorEmployees { get; set; }
    public DbSet<Goal> Goals { get; set; }
    public DbSet<GoalTask> Tasks { get; set; }
    public DbSet<Review> Reviews { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
            entity.Property(e => e.PasswordHash).IsRequired();
            entity.Property(e => e.Role).IsRequired().HasMaxLength(50);
            entity.Property(e => e.FullName).IsRequired().HasMaxLength(255);
        });

        // MentorEmployee configuration
        modelBuilder.Entity<MentorEmployee>(entity =>
        {
            entity.HasKey(e => new { e.MentorId, e.EmployeeId });
            entity.HasOne(e => e.Mentor)
                .WithMany(u => u.MentorRelationships)
                .HasForeignKey(e => e.MentorId)
                .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.Employee)
                .WithMany(u => u.EmployeeRelationships)
                .HasForeignKey(e => e.EmployeeId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Goal configuration
        modelBuilder.Entity<Goal>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(500);
            entity.Property(e => e.Description).HasMaxLength(2000);
            entity.HasOne(e => e.Employee)
                .WithMany(u => u.Goals)
                .HasForeignKey(e => e.EmployeeId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // GoalTask configuration
        modelBuilder.Entity<GoalTask>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(500);
            entity.Property(e => e.Description).HasMaxLength(2000);
            entity.HasOne(e => e.Goal)
                .WithMany(g => g.Tasks)
                .HasForeignKey(e => e.GoalId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Review configuration
        modelBuilder.Entity<Review>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Content).IsRequired().HasMaxLength(2000);
            entity.HasOne(e => e.Reviewer)
                .WithMany(u => u.ReviewsGiven)
                .HasForeignKey(e => e.ReviewerId)
                .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.Reviewee)
                .WithMany(u => u.ReviewsReceived)
                .HasForeignKey(e => e.RevieweeId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
}

