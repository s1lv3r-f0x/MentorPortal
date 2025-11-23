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
public class GoalsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public GoalsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<GoalDto>>> GetGoals()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var userRole = User.FindFirstValue(ClaimTypes.Role)!;

        IQueryable<Goal> goalsQuery;

        if (userRole == "Employee")
        {
            goalsQuery = _context.Goals.Where(g => g.EmployeeId == userId);
        }
        else
        {
            return Forbid("Only employees can view their own goals");
        }

        var goals = await goalsQuery
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

    [HttpGet("{id}")]
    public async Task<ActionResult<GoalDto>> GetGoal(int id)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var userRole = User.FindFirstValue(ClaimTypes.Role)!;

        var goal = await _context.Goals
            .Include(g => g.Tasks)
            .FirstOrDefaultAsync(g => g.Id == id);

        if (goal == null)
        {
            return NotFound();
        }

        if (userRole == "Employee" && goal.EmployeeId != userId)
        {
            return Forbid();
        }

        var goalDto = new GoalDto
        {
            Id = goal.Id,
            EmployeeId = goal.EmployeeId,
            Title = goal.Title,
            Description = goal.Description,
            Status = goal.Status,
            CreatedAt = goal.CreatedAt,
            UpdatedAt = goal.UpdatedAt,
            TotalTasks = goal.Tasks.Count,
            CompletedTasks = goal.Tasks.Count(t => t.Status == Models.TaskStatus.Completed)
        };

        return Ok(goalDto);
    }

    [HttpPost]
    public async Task<ActionResult<GoalDto>> CreateGoal(CreateGoalDto createGoalDto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var userRole = User.FindFirstValue(ClaimTypes.Role)!;

        if (userRole != "Employee")
        {
            return Forbid("Only employees can create goals");
        }

        var goal = new Goal
        {
            EmployeeId = userId,
            Title = createGoalDto.Title,
            Description = createGoalDto.Description,
            Status = GoalStatus.Draft
        };

        _context.Goals.Add(goal);
        await _context.SaveChangesAsync();

        var goalDto = new GoalDto
        {
            Id = goal.Id,
            EmployeeId = goal.EmployeeId,
            Title = goal.Title,
            Description = goal.Description,
            Status = goal.Status,
            CreatedAt = goal.CreatedAt,
            UpdatedAt = goal.UpdatedAt,
            TotalTasks = 0,
            CompletedTasks = 0
        };

        return CreatedAtAction(nameof(GetGoal), new { id = goal.Id }, goalDto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateGoal(int id, UpdateGoalDto updateGoalDto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var userRole = User.FindFirstValue(ClaimTypes.Role)!;

        var goal = await _context.Goals.FindAsync(id);

        if (goal == null)
        {
            return NotFound();
        }

        if (userRole == "Employee" && goal.EmployeeId != userId)
        {
            return Forbid();
        }

        goal.Title = updateGoalDto.Title;
        goal.Description = updateGoalDto.Description;
        goal.Status = updateGoalDto.Status;
        goal.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteGoal(int id)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var userRole = User.FindFirstValue(ClaimTypes.Role)!;

        var goal = await _context.Goals.FindAsync(id);

        if (goal == null)
        {
            return NotFound();
        }

        if (userRole == "Employee" && goal.EmployeeId != userId)
        {
            return Forbid();
        }

        _context.Goals.Remove(goal);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

