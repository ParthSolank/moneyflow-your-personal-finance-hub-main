using MoneyFlow.Domain.Entities;
using System.Security.Claims;

namespace MoneyFlow.Application.Common.Interfaces
{
    public interface ITokenService
    {
        string GenerateAccessToken(ApplicationUser user, IEnumerable<Claim> claims);
        string GenerateRefreshToken();
        ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
    }
}
