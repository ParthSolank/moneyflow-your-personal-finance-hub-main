using MediatR;
using Microsoft.AspNetCore.Identity;
using MoneyFlow.Domain.Entities;

namespace MoneyFlow.Application.Users.Commands.ChangeUserRole
{
    public class ChangeUserRoleCommand : IRequest<bool>
    {
        public string Id { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
    }

    public class ChangeUserRoleCommandHandler : IRequestHandler<ChangeUserRoleCommand, bool>
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public ChangeUserRoleCommandHandler(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public async Task<bool> Handle(ChangeUserRoleCommand request, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByIdAsync(request.Id);
            if (user == null)
            {
                return false;
            }

            var roleName = request.Role.ToLower();

            // Check if user already has this role
            var currentRoles = await _userManager.GetRolesAsync(user);
            if (currentRoles.Contains(roleName))
            {
                return true;
            }

            // Remove current roles
            if (currentRoles.Any())
            {
                await _userManager.RemoveFromRolesAsync(user, currentRoles);
            }

            // Check if role exists, if not create it
            if (!await _roleManager.RoleExistsAsync(roleName))
            {
                await _roleManager.CreateAsync(new IdentityRole(roleName));
            }

            // Add new role
            var result = await _userManager.AddToRoleAsync(user, roleName);
            
            return result.Succeeded;
        }
    }
}
