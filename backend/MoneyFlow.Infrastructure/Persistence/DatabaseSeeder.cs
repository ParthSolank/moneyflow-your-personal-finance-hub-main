using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MoneyFlow.Domain.Entities;
using System.Security.Claims;

namespace MoneyFlow.Infrastructure.Persistence
{
    /// <summary>
    /// Service responsible for initializing the database with essential data on startup.
    /// Handles:
    /// - Creating default Identity roles (Admin, User).
    /// - Seeding initial administrative accounts.
    /// - Ensuring access recovery for specific system users.
    /// </summary>
    public class DatabaseSeeder
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public DatabaseSeeder(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public async Task SeedAsync()
        {
            // Seed Roles
            string[] roleNames = { "admin", "user" };
            foreach (var roleName in roleNames)
            {
                if (!await _roleManager.RoleExistsAsync(roleName))
                {
                    await _roleManager.CreateAsync(new IdentityRole(roleName));
                }
            }

            // Seed Admin User
            var adminEmail = "admin@moneyflow.com";
            var adminUser = await _userManager.FindByEmailAsync(adminEmail);

            if (adminUser == null)
            {
                adminUser = new ApplicationUser
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    FullName = "System Administrator",
                    EmailConfirmed = true
                };

                var result = await _userManager.CreateAsync(adminUser, "Admin@123");
                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(adminUser, "admin");
                }
            }

            // Fix rox@gmail.com user if it exists
            var roxEmail = "rox@gmail.com";
            var roxUser = await _userManager.FindByEmailAsync(roxEmail);
            if (roxUser != null)
            {
                // Ensure rox is an admin
                if (!await _userManager.IsInRoleAsync(roxUser, "admin"))
                {
                    await _userManager.AddToRoleAsync(roxUser, "admin");
                }

                // Reset password to Admin@123 so user can login
                await _userManager.RemovePasswordAsync(roxUser);
                await _userManager.AddPasswordAsync(roxUser, "Admin@123");
            }
        }
    }
}
