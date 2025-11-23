using MentorPortal.API.Models;

namespace MentorPortal.API.DTOs;

public class GoalDto
{
    public int Id { get; set; }
    public int EmployeeId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public GoalStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public int TotalTasks { get; set; }
    public int CompletedTasks { get; set; }
}

public class CreateGoalDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public class UpdateGoalDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public GoalStatus Status { get; set; }
}

