using System.ComponentModel.DataAnnotations;
using MentorPortal.API.Models;

namespace MentorPortal.API.DTOs;

public class TaskDto
{
    public int Id { get; set; }
    public int GoalId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Models.TaskStatus Status { get; set; }
    public int Order { get; set; }
    public DateTime? DueDate { get; set; }
    public DateTime? CompletedAt { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateTaskDto
{
    [Required]
    [MinLength(1)]
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime? DueDate { get; set; }
}

public class UpdateTaskDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Models.TaskStatus Status { get; set; }
    public DateTime? DueDate { get; set; }
}

public class ReorderTasksDto
{
    public List<int> TaskIds { get; set; } = new();
}

