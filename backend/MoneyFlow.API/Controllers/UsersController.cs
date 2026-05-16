using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MoneyFlow.Application.Users.Commands.ChangeUserRole;
using MoneyFlow.Application.Users.Commands.DeleteUser;
using MoneyFlow.Application.Users.Commands.ToggleUserStatus;
using MoneyFlow.Application.Users.Commands.UpdatePermissions;
using MoneyFlow.Application.Users.Queries.GetPermissions;
using MoneyFlow.Application.Users.Queries.GetUsers;

namespace MoneyFlow.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // [Authorize(Roles = "admin")] // Uncomment when roles are properly set up
    public class UsersController : ControllerBase
    {
        private readonly IMediator _mediator;

        public UsersController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult<List<UserDto>>> GetUsers()
        {
            return Ok(await _mediator.Send(new GetUsersQuery()));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var result = await _mediator.Send(new DeleteUserCommand { Id = id });
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }

        [HttpPut("{id}/toggle-status")]
        public async Task<IActionResult> ToggleUserStatus(string id)
        {
            var result = await _mediator.Send(new ToggleUserStatusCommand { Id = id });
            if (!result)
            {
                return NotFound();
            }
            return Ok();
        }

        [HttpPut("{id}/change-role")]
        public async Task<IActionResult> ChangeRole(string id, [FromBody] ChangeRoleRequest request)
        {
            var result = await _mediator.Send(new ChangeUserRoleCommand { Id = id, Role = request.Role });
            if (!result)
            {
                return NotFound();
            }
            return Ok();
        }

        [HttpGet("{id}/permissions")]
        public async Task<IActionResult> GetPermissions(string id)
        {
            var result = await _mediator.Send(new GetPermissionsQuery { UserId = id });
            return Ok(result);
        }

        [HttpPut("{id}/permissions")]
        public async Task<IActionResult> UpdatePermissions(string id, [FromBody] List<ModulePermissionDto> permissions)
        {
            var result = await _mediator.Send(new UpdatePermissionsCommand { UserId = id, Permissions = permissions });
            return Ok(result);
        }

        public class ChangeRoleRequest
        {
            public string Role { get; set; } = string.Empty;
        }
    }
}
