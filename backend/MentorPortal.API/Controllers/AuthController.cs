using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MentorPortal.API.Data;
using MentorPortal.API.DTOs;
using MentorPortal.API.Models;
using MentorPortal.API.Services;
using BCrypt.Net;

namespace MentorPortal.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ITokenService _tokenService;

    public AuthController(ApplicationDbContext context, ITokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto registerDto)
    {
        if (registerDto.Role != "Mentor" && registerDto.Role != "Employee")
        {
            return BadRequest("Role must be either 'Mentor' or 'Employee'");
        }

        if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
        {
            return BadRequest("Email already exists");
        }

        var user = new User
        {
            Email = registerDto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
            FullName = registerDto.FullName,
            Role = registerDto.Role
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var token = _tokenService.GenerateToken(user);

        return Ok(new AuthResponseDto
        {
            Token = token,
            UserId = user.Id,
            Email = user.Email,
            FullName = user.FullName,
            Role = user.Role
        });
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login(LoginDto loginDto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);

        if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
        {
            return Unauthorized("Invalid email or password");
        }

        var token = _tokenService.GenerateToken(user);

        return Ok(new AuthResponseDto
        {
            Token = token,
            UserId = user.Id,
            Email = user.Email,
            FullName = user.FullName,
            Role = user.Role
        });
    }
}

