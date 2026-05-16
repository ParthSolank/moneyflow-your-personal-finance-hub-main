using MediatR;
using Microsoft.AspNetCore.Identity;
using MoneyFlow.Domain.Entities;

namespace MoneyFlow.Application.Users.Commands.ToggleUserStatus
{
    public class ToggleUserStatusCommand : IRequest<bool>
    {
        public string Id { get; set; } = string.Empty;
    }

    public class ToggleUserStatusCommandHandler : IRequestHandler<ToggleUserStatusCommand, bool>
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public ToggleUserStatusCommandHandler(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        public async Task<bool> Handle(ToggleUserStatusCommand request, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByIdAsync(request.Id);
            if (user == null)
            {
                return false;
            }

            user.IsActive = !user.IsActive;
            var result = await _userManager.UpdateAsync(user);
            return result.Succeeded;
        }
    }
}
