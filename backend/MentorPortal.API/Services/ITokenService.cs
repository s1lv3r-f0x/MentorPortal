using MentorPortal.API.Models;

namespace MentorPortal.API.Services;

public interface ITokenService
{
    string GenerateToken(User user);
}

