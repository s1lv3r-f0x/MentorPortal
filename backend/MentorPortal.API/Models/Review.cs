namespace MentorPortal.API.Models;

public class Review
{
    public int Id { get; set; }
    public int ReviewerId { get; set; }
    public int RevieweeId { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool IsVisibleToMentor { get; set; } = true;

    // Navigation properties
    public virtual User Reviewer { get; set; } = null!;
    public virtual User Reviewee { get; set; } = null!;
}

