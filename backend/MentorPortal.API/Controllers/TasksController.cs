using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using MentorPortal.API.Data;
using MentorPortal.API.DTOs;
using MentorPortal.API.Models;

namespace MentorPortal.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TasksController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public TasksController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("goals/{goalId}")]
    public async Task<ActionResult<IEnumerable<TaskDto>>> GetTasks(int goalId)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var userRole = User.FindFirstValue(ClaimTypes.Role)!;

        var goal = await _context.Goals.FindAsync(goalId);
        if (goal == null)
        {
            return NotFound("Goal not found");
        }

        if (userRole == "Employee" && goal.EmployeeId != userId)
        {
            return Forbid();
        }

        var tasks = await _context.Tasks
            .Where(t => t.GoalId == goalId)
            .OrderBy(t => t.Order)
            .ToListAsync();

        var taskDtos = tasks.Select(t => new TaskDto
        {
            Id = t.Id,
            GoalId = t.GoalId,
            Title = t.Title,
            Description = t.Description,
            Status = t.Status,
            Order = t.Order,
            DueDate = t.DueDate,
            CompletedAt = t.CompletedAt,
            CreatedAt = t.CreatedAt
        });

        return Ok(taskDtos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TaskDto>> GetTask(int id)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var userRole = User.FindFirstValue(ClaimTypes.Role)!;

        var task = await _context.Tasks
            .Include(t => t.Goal)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (task == null)
        {
            return NotFound();
        }

        if (userRole == "Employee" && task.Goal.EmployeeId != userId)
        {
            return Forbid();
        }

        var taskDto = new TaskDto
        {
            Id = task.Id,
            GoalId = task.GoalId,
            Title = task.Title,
            Description = task.Description,
            Status = task.Status,
            Order = task.Order,
            DueDate = task.DueDate,
            CompletedAt = task.CompletedAt,
            CreatedAt = task.CreatedAt
        };

        return Ok(taskDto);
    }

    [HttpPost("goals/{goalId}")]
    public async Task<ActionResult<TaskDto>> CreateTask(int goalId, CreateTaskDto createTaskDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var userRole = User.FindFirstValue(ClaimTypes.Role)!;

        var goal = await _context.Goals.FindAsync(goalId);
        if (goal == null)
        {
            return NotFound("Goal not found");
        }

        if (userRole == "Employee" && goal.EmployeeId != userId)
        {
            return Forbid();
        }

        var hasTasks = await _context.Tasks.AnyAsync(t => t.GoalId == goalId);
        var maxOrder = hasTasks 
            ? await _context.Tasks
                .Where(t => t.GoalId == goalId)
                .MaxAsync(t => t.Order)
            : 0;
        
        var nextOrder = maxOrder + 1;

        DateTime? dueDateUtc = null;
        if (createTaskDto.DueDate.HasValue)
        {
            var dueDate = createTaskDto.DueDate.Value;
            if (dueDate.Kind == DateTimeKind.Unspecified)
            {
                dueDateUtc = DateTime.SpecifyKind(dueDate, DateTimeKind.Utc);
            }
            else
            {
                dueDateUtc = dueDate.ToUniversalTime();
            }
        }

        var task = new GoalTask
        {
            GoalId = goalId,
            Title = createTaskDto.Title,
            Description = createTaskDto.Description,
            Status = Models.TaskStatus.NotStarted,
            Order = nextOrder,
            DueDate = dueDateUtc
        };

        try
        {
            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
        {
            return BadRequest($"Database error: {ex.InnerException?.Message ?? ex.Message}");
        }
        catch (Exception ex)
        {
            return BadRequest($"Error saving task: {ex.Message}");
        }

        var taskDto = new TaskDto
        {
            Id = task.Id,
            GoalId = task.GoalId,
            Title = task.Title,
            Description = task.Description,
            Status = task.Status,
            Order = task.Order,
            DueDate = task.DueDate,
            CompletedAt = task.CompletedAt,
            CreatedAt = task.CreatedAt
        };

        return CreatedAtAction(nameof(GetTask), new { id = task.Id }, taskDto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTask(int id, UpdateTaskDto updateTaskDto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var userRole = User.FindFirstValue(ClaimTypes.Role)!;

        var task = await _context.Tasks
            .Include(t => t.Goal)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (task == null)
        {
            return NotFound();
        }

        if (userRole == "Employee" && task.Goal.EmployeeId != userId)
        {
            return Forbid();
        }

        task.Title = updateTaskDto.Title;
        task.Description = updateTaskDto.Description;
        task.Status = updateTaskDto.Status;
        
        DateTime? dueDateUtc = null;
        if (updateTaskDto.DueDate.HasValue)
        {
            var dueDate = updateTaskDto.DueDate.Value;
            if (dueDate.Kind == DateTimeKind.Unspecified)
            {
                dueDateUtc = DateTime.SpecifyKind(dueDate, DateTimeKind.Utc);
            }
            else
            {
                dueDateUtc = dueDate.ToUniversalTime();
            }
        }
        task.DueDate = dueDateUtc;

        if (updateTaskDto.Status == Models.TaskStatus.Completed && task.CompletedAt == null)
        {
            task.CompletedAt = DateTime.UtcNow;
        }
        else if (updateTaskDto.Status != Models.TaskStatus.Completed)
        {
            task.CompletedAt = null;
        }

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(int id)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var userRole = User.FindFirstValue(ClaimTypes.Role)!;

        var task = await _context.Tasks
            .Include(t => t.Goal)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (task == null)
        {
            return NotFound();
        }

        if (userRole == "Employee" && task.Goal.EmployeeId != userId)
        {
            return Forbid();
        }

        _context.Tasks.Remove(task);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpPut("goals/{goalId}/reorder")]
    public async Task<IActionResult> ReorderTasks(int goalId, ReorderTasksDto reorderDto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var userRole = User.FindFirstValue(ClaimTypes.Role)!;

        var goal = await _context.Goals.FindAsync(goalId);
        if (goal == null)
        {
            return NotFound("Goal not found");
        }

        if (userRole == "Employee" && goal.EmployeeId != userId)
        {
            return Forbid();
        }

        var tasks = await _context.Tasks
            .Where(t => t.GoalId == goalId)
            .ToListAsync();

        for (int i = 0; i < reorderDto.TaskIds.Count; i++)
        {
            var task = tasks.FirstOrDefault(t => t.Id == reorderDto.TaskIds[i]);
            if (task != null)
            {
                task.Order = i + 1;
            }
        }

        await _context.SaveChangesAsync();

        return NoContent();
    }
}

