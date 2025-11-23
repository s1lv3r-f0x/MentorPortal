namespace MentorPortal.API.Models;

public enum TaskStatus
{
    NotStarted,
    InProgress,
    Completed,
    Blocked
}

public class GoalTask
{
    public int Id { get; set; }
    public int GoalId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public TaskStatus Status { get; set; } = TaskStatus.NotStarted;
    public int Order { get; set; }
    public DateTime? DueDate { get; set; }
    public DateTime? CompletedAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual Goal Goal { get; set; } = null!;
}

