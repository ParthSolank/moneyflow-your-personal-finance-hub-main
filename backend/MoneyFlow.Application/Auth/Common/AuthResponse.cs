namespace MoneyFlow.Application.Auth.Common
{
    public record AuthResponse(string Token, string RefreshToken, string Email, string FullName, string Role);
}
