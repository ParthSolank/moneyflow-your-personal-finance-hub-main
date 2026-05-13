using MediatR;
using Microsoft.AspNetCore.Mvc;
using MoneyFlow.Application.Auth.Commands.Register;
using MoneyFlow.Application.Auth.Commands.RefreshToken;
using MoneyFlow.Application.Auth.Queries.Login;

namespace MoneyFlow.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IMediator _mediator;

        public AuthController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterCommand command)
        {
            return Ok(await _mediator.Send(command));
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginQuery query)
        {
            return Ok(await _mediator.Send(query));
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken(RefreshTokenCommand command)
        {
            return Ok(await _mediator.Send(command));
        }
    }
}
