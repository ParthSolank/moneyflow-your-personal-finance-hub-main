using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using MoneyFlow.Application.Budgets.Queries.GetBudgets;
using MoneyFlow.Application.Budgets.Commands.UpsertBudget;

namespace MoneyFlow.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class BudgetsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public BudgetsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult<List<BudgetDto>>> Get([FromQuery] int month, [FromQuery] int year)
        {
            return await _mediator.Send(new GetBudgetsQuery(month, year));
        }

        [HttpPost]
        public async Task<ActionResult<Guid>> Upsert(UpsertBudgetCommand command)
        {
            return await _mediator.Send(command);
        }
    }
}
