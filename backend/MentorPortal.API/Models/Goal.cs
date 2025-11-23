namespace MentorPortal.API.Models;

public enum GoalStatus
{
    Draft,
    InProgress,
    Completed,
    Cancelled
}

public class Goal
{
    public int Id { get; set; }
    public int EmployeeId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public GoalStatus Status { get; set; } = GoalStatus.Draft;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual User Employee { get; set; } = null!;
    public virtual ICollection<GoalTask> Tasks { get; set; } = new List<GoalTask>();
}

