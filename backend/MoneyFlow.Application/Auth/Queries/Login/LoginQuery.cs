using MediatR;
using Microsoft.AspNetCore.Identity;
using MoneyFlow.Application.Auth.Common;
using MoneyFlow.Application.Common.Interfaces;
using MoneyFlow.Domain.Entities;
using System.Security.Claims;

namespace MoneyFlow.Application.Auth.Queries.Login
{
    public record LoginQuery(string Email, string Password) : IRequest<AuthResponse>;

    public class LoginQueryHandler : IRequestHandler<LoginQuery, AuthResponse>
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ITokenService _tokenService;

        public LoginQueryHandler(UserManager<ApplicationUser> userManager, ITokenService tokenService)
        {
            _userManager = userManager;
            _tokenService = tokenService;
        }

        public async Task<AuthResponse> Handle(LoginQuery request, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);

            if (user == null || !await _userManager.CheckPasswordAsync(user, request.Password))
            {
                throw new Exception("Invalid email or password");
            }

            var roles = await _userManager.GetRolesAsync(user);
            var role = roles.FirstOrDefault() ?? "user";

            var claims = new List<Claim> 
            { 
                new Claim(ClaimTypes.Email, user.Email!),
                new Claim(ClaimTypes.Role, role)
            };

            var token = _tokenService.GenerateAccessToken(user, claims);
            var refreshToken = _tokenService.GenerateRefreshToken();

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            await _userManager.UpdateAsync(user);

            return new AuthResponse(token, refreshToken, user.Email!, user.FullName!, role);
        }
    }
}
