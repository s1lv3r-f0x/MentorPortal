namespace MentorPortal.API.Models;

public class User
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty; // "Mentor" or "Employee"
    public string FullName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual ICollection<MentorEmployee> MentorRelationships { get; set; } = new List<MentorEmployee>();
    public virtual ICollection<MentorEmployee> EmployeeRelationships { get; set; } = new List<MentorEmployee>();
    public virtual ICollection<Goal> Goals { get; set; } = new List<Goal>();
    public virtual ICollection<Review> ReviewsGiven { get; set; } = new List<Review>();
    public virtual ICollection<Review> ReviewsReceived { get; set; } = new List<Review>();
}

