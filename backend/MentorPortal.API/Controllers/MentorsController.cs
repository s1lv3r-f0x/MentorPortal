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
[Authorize(Roles = "Mentor")]
public class MentorsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public MentorsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("employees")]
    public async Task<ActionResult<IEnumerable<EmployeeDto>>> GetEmployees()
    {
        var mentorId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var employees = await _context.MentorEmployees
            .Where(me => me.MentorId == mentorId)
            .Include(me => me.Employee)
            .ThenInclude(e => e.Goals)
            .Select(me => new EmployeeDto
            {
                Id = me.EmployeeId,
                Email = me.Employee.Email,
                FullName = me.Employee.FullName,
                TotalGoals = me.Employee.Goals.Count,
                ActiveGoals = me.Employee.Goals.Count(g => g.Status == GoalStatus.InProgress || g.Status == GoalStatus.Draft)
            })
            .ToListAsync();

        return Ok(employees);
    }

    [HttpGet("employees/{employeeId}/goals")]
    public async Task<ActionResult<IEnumerable<GoalDto>>> GetEmployeeGoals(int employeeId)
    {
        var mentorId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var mentorEmployee = await _context.MentorEmployees
            .FirstOrDefaultAsync(me => me.MentorId == mentorId && me.EmployeeId == employeeId);

        if (mentorEmployee == null)
        {
            return Forbid("You don't have access to this employee's goals");
        }

        var goals = await _context.Goals
            .Where(g => g.EmployeeId == employeeId)
            .Include(g => g.Tasks)
            .OrderByDescending(g => g.CreatedAt)
            .ToListAsync();

        var goalDtos = goals.Select(g => new GoalDto
        {
            Id = g.Id,
            EmployeeId = g.EmployeeId,
            Title = g.Title,
            Description = g.Description,
            Status = g.Status,
            CreatedAt = g.CreatedAt,
            UpdatedAt = g.UpdatedAt,
            TotalTasks = g.Tasks.Count,
            CompletedTasks = g.Tasks.Count(t => t.Status == Models.TaskStatus.Completed)
        });

        return Ok(goalDtos);
    }

    [HttpPut("goals/{id}/approve")]
    public async Task<IActionResult> ApproveGoal(int id, UpdateGoalDto updateGoalDto)
    {
        var mentorId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var goal = await _context.Goals
            .Include(g => g.Employee)
            .FirstOrDefaultAsync(g => g.Id == id);

        if (goal == null)
        {
            return NotFound();
        }

        var mentorEmployee = await _context.MentorEmployees
            .FirstOrDefaultAsync(me => me.MentorId == mentorId && me.EmployeeId == goal.EmployeeId);

        if (mentorEmployee == null)
        {
            return Forbid("You don't have access to this goal");
        }

        goal.Title = updateGoalDto.Title;
        goal.Description = updateGoalDto.Description;
        goal.Status = updateGoalDto.Status;
        goal.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpPut("tasks/{id}/approve")]
    public async Task<IActionResult> ApproveTask(int id, UpdateTaskDto updateTaskDto)
    {
        var mentorId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var task = await _context.Tasks
            .Include(t => t.Goal)
            .ThenInclude(g => g.Employee)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (task == null)
        {
            return NotFound();
        }

        var mentorEmployee = await _context.MentorEmployees
            .FirstOrDefaultAsync(me => me.MentorId == mentorId && me.EmployeeId == task.Goal.EmployeeId);

        if (mentorEmployee == null)
        {
            return Forbid("You don't have access to this task");
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
}

