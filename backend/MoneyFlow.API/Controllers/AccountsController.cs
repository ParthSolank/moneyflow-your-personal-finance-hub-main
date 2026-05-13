using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using MoneyFlow.Application.Accounts.Queries.GetAccounts;
using MoneyFlow.Application.Accounts.Queries.GetAccountById;
using MoneyFlow.Application.Accounts.Commands.CreateAccount;
using MoneyFlow.Application.Accounts.Commands.UpdateAccount;
using MoneyFlow.Application.Accounts.Commands.DeleteAccount;

namespace MoneyFlow.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AccountsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public AccountsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult<List<AccountDto>>> Get()
        {
            return await _mediator.Send(new GetAccountsQuery());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AccountDto>> GetById(Guid id)
        {
            return await _mediator.Send(new GetAccountByIdQuery(id));
        }

        [HttpPost]
        public async Task<ActionResult<Guid>> Create(CreateAccountCommand command)
        {
            return await _mediator.Send(command);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(Guid id, UpdateAccountCommand command)
        {
            if (id != command.Id)
            {
                return BadRequest();
            }

            await _mediator.Send(command);

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(Guid id)
        {
            await _mediator.Send(new DeleteAccountCommand(id));

            return NoContent();
        }
    }
}
