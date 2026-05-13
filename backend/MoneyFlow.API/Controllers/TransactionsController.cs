using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using MoneyFlow.Application.Transactions.Queries.GetTransactions;
using MoneyFlow.Application.Transactions.Commands.CreateTransaction;
using MoneyFlow.Application.Transactions.Commands.UpdateTransaction;
using MoneyFlow.Application.Transactions.Commands.DeleteTransaction;

namespace MoneyFlow.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public TransactionsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult<List<TransactionDto>>> Get([FromQuery] GetTransactionsQuery query)
        {
            return await _mediator.Send(query);
        }

        [HttpPost]
        public async Task<ActionResult<Guid>> Create(CreateTransactionCommand command)
        {
            return await _mediator.Send(command);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(Guid id, UpdateTransactionCommand command)
        {
            if (id != command.Id) return BadRequest();
            await _mediator.Send(command);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(Guid id)
        {
            await _mediator.Send(new DeleteTransactionCommand(id));
            return NoContent();
        }
    }
}
