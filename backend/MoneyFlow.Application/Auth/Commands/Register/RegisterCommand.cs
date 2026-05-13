using MediatR;
using Microsoft.AspNetCore.Identity;
using MoneyFlow.Application.Auth.Common;
using MoneyFlow.Application.Common.Interfaces;
using MoneyFlow.Domain.Entities;
using System.Security.Claims;

namespace MoneyFlow.Application.Auth.Commands.Register
{
    public record RegisterCommand(string Email, string Password, string FullName) : IRequest<AuthResponse>;

    public class RegisterCommandHandler : IRequestHandler<RegisterCommand, AuthResponse>
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ITokenService _tokenService;

        public RegisterCommandHandler(UserManager<ApplicationUser> userManager, ITokenService tokenService)
        {
            _userManager = userManager;
            _tokenService = tokenService;
        }

        public async Task<AuthResponse> Handle(RegisterCommand request, CancellationToken cancellationToken)
        {
            var user = new ApplicationUser
            {
                UserName = request.Email,
                Email = request.Email,
                FullName = request.FullName
            };

            var result = await _userManager.CreateAsync(user, request.Password);

            if (!result.Succeeded)
            {
                throw new Exception(string.Join(", ", result.Errors.Select(e => e.Description)));
            }

            var claims = new List<Claim> { new Claim(ClaimTypes.Email, user.Email!) };
            var token = _tokenService.GenerateAccessToken(user, claims);
            var refreshToken = _tokenService.GenerateRefreshToken();

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            await _userManager.UpdateAsync(user);

            return new AuthResponse(token, refreshToken, user.Email!, user.FullName!);
        }
    }
}
