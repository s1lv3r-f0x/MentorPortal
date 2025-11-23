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
public class ReviewsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ReviewsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<ActionResult<ReviewDto>> CreateReview(CreateReviewDto createReviewDto)
    {
        var reviewerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var reviewee = await _context.Users.FindAsync(createReviewDto.RevieweeId);
        if (reviewee == null)
        {
            return NotFound("Reviewee not found");
        }

        if (reviewee.Id == reviewerId)
        {
            return BadRequest("Cannot review yourself");
        }

        var review = new Review
        {
            ReviewerId = reviewerId,
            RevieweeId = createReviewDto.RevieweeId,
            Content = createReviewDto.Content,
            IsVisibleToMentor = true
        };

        _context.Reviews.Add(review);
        await _context.SaveChangesAsync();

        var reviewDto = await _context.Reviews
            .Where(r => r.Id == review.Id)
            .Include(r => r.Reviewer)
            .Include(r => r.Reviewee)
            .Select(r => new ReviewDto
            {
                Id = r.Id,
                ReviewerId = r.ReviewerId,
                ReviewerName = r.Reviewer.FullName,
                RevieweeId = r.RevieweeId,
                RevieweeName = r.Reviewee.FullName,
                Content = r.Content,
                CreatedAt = r.CreatedAt
            })
            .FirstOrDefaultAsync();

        return CreatedAtAction(nameof(GetReview), new { id = review.Id }, reviewDto);
    }

    [HttpGet("mentor")]
    [Authorize(Roles = "Mentor")]
    public async Task<ActionResult<IEnumerable<ReviewDto>>> GetMentorReviews()
    {
        var mentorId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var employeeIds = await _context.MentorEmployees
            .Where(me => me.MentorId == mentorId)
            .Select(me => me.EmployeeId)
            .ToListAsync();

        var reviews = await _context.Reviews
            .Where(r => employeeIds.Contains(r.RevieweeId) && r.IsVisibleToMentor)
            .Include(r => r.Reviewer)
            .Include(r => r.Reviewee)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new ReviewDto
            {
                Id = r.Id,
                ReviewerId = r.ReviewerId,
                ReviewerName = r.Reviewer.FullName,
                RevieweeId = r.RevieweeId,
                RevieweeName = r.Reviewee.FullName,
                Content = r.Content,
                CreatedAt = r.CreatedAt
            })
            .ToListAsync();

        return Ok(reviews);
    }

    [HttpGet("my")]
    [Authorize(Roles = "Mentor")]
    public async Task<ActionResult<IEnumerable<ReviewDto>>> GetMyReviews()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var reviews = await _context.Reviews
            .Where(r => r.RevieweeId == userId)
            .Include(r => r.Reviewer)
            .Include(r => r.Reviewee)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new ReviewDto
            {
                Id = r.Id,
                ReviewerId = r.ReviewerId,
                ReviewerName = r.Reviewer.FullName,
                RevieweeId = r.RevieweeId,
                RevieweeName = r.Reviewee.FullName,
                Content = r.Content,
                CreatedAt = r.CreatedAt
            })
            .ToListAsync();

        return Ok(reviews);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ReviewDto>> GetReview(int id)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var userRole = User.FindFirstValue(ClaimTypes.Role)!;

        var review = await _context.Reviews
            .Include(r => r.Reviewer)
            .Include(r => r.Reviewee)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (review == null)
        {
            return NotFound();
        }

        if (userRole == "Mentor")
        {
            var mentorEmployee = await _context.MentorEmployees
                .FirstOrDefaultAsync(me => me.MentorId == userId && me.EmployeeId == review.RevieweeId);

            if (mentorEmployee == null && review.RevieweeId != userId)
            {
                return Forbid();
            }
        }
        else
        {
            if (review.ReviewerId != userId && review.RevieweeId != userId)
            {
                return Forbid();
            }
        }

        var reviewDto = new ReviewDto
        {
            Id = review.Id,
            ReviewerId = review.ReviewerId,
            ReviewerName = review.Reviewer.FullName,
            RevieweeId = review.RevieweeId,
            RevieweeName = review.Reviewee.FullName,
            Content = review.Content,
            CreatedAt = review.CreatedAt
        };

        return Ok(reviewDto);
    }
}

