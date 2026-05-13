using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using MoneyFlow.Application.Analytics.Queries.GetDashboardSummary;
using MoneyFlow.Application.Analytics.Queries.GetSpendingByCategory;
using MoneyFlow.Application.Analytics.Queries.GetCashflow;

namespace MoneyFlow.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AnalyticsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public AnalyticsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("summary")]
        public async Task<ActionResult<DashboardSummaryDto>> GetSummary()
        {
            return await _mediator.Send(new GetDashboardSummaryQuery());
        }

        [HttpGet("spending-by-category")]
        public async Task<ActionResult<List<CategorySpendingDto>>> GetSpendingByCategory([FromQuery] int month, [FromQuery] int year)
        {
            return await _mediator.Send(new GetSpendingByCategoryQuery(month, year));
        }

        [HttpGet("cashflow")]
        public async Task<ActionResult<List<CashflowDto>>> GetCashflow()
        {
            return await _mediator.Send(new GetCashflowQuery());
        }
    }
}
