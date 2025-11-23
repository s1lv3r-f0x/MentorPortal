namespace MentorPortal.API.DTOs;

public class ReviewDto
{
    public int Id { get; set; }
    public int ReviewerId { get; set; }
    public string ReviewerName { get; set; } = string.Empty;
    public int RevieweeId { get; set; }
    public string RevieweeName { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class CreateReviewDto
{
    public int RevieweeId { get; set; }
    public string Content { get; set; } = string.Empty;
}

