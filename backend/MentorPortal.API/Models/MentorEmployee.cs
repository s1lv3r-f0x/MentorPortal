namespace MentorPortal.API.Models;

public class MentorEmployee
{
    public int MentorId { get; set; }
    public int EmployeeId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual User Mentor { get; set; } = null!;
    public virtual User Employee { get; set; } = null!;
}

