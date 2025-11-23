namespace MentorPortal.API.DTOs;

public class EmployeeDto
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public int TotalGoals { get; set; }
    public int ActiveGoals { get; set; }
}

