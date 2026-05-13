using MediatR;
using Microsoft.AspNetCore.Identity;
using MoneyFlow.Application.Auth.Common;
using MoneyFlow.Application.Common.Interfaces;
using MoneyFlow.Domain.Entities;
using System.Security.Claims;

namespace MoneyFlow.Application.Auth.Commands.RefreshToken
{
    public record RefreshTokenCommand(string Token, string RefreshToken) : IRequest<AuthResponse>;

    public class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, AuthResponse>
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ITokenService _tokenService;

        public RefreshTokenCommandHandler(UserManager<ApplicationUser> userManager, ITokenService tokenService)
        {
            _userManager = userManager;
            _tokenService = tokenService;
        }

        public async Task<AuthResponse> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
        {
            var principal = _tokenService.GetPrincipalFromExpiredToken(request.Token);
            var email = principal.FindFirstValue(ClaimTypes.Email);
            
            var user = await _userManager.FindByEmailAsync(email!);

            if (user == null || user.RefreshToken != request.RefreshToken || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            {
                throw new Exception("Invalid refresh token");
            }

            var claims = principal.Claims;
            var newToken = _tokenService.GenerateAccessToken(user, claims);
            var newRefreshToken = _tokenService.GenerateRefreshToken();

            user.RefreshToken = newRefreshToken;
            await _userManager.UpdateAsync(user);

            return new AuthResponse(newToken, newRefreshToken, user.Email!, user.FullName!);
        }
    }
}
