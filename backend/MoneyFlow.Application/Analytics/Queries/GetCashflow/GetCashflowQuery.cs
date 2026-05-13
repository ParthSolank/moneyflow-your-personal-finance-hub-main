using MediatR;
using Microsoft.EntityFrameworkCore;
using MoneyFlow.Application.Common.Interfaces;

namespace MoneyFlow.Application.Analytics.Queries.GetCashflow
{
    public record CashflowDto(string Month, decimal Income, decimal Expense);

    public record GetCashflowQuery : IRequest<List<CashflowDto>>;

    public class GetCashflowQueryHandler : IRequestHandler<GetCashflowQuery, List<CashflowDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;

        public GetCashflowQueryHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
        }

        public async Task<List<CashflowDto>> Handle(GetCashflowQuery request, CancellationToken cancellationToken)
        {
            var userId = _currentUserService.UserId;
            var endDate = DateTime.UtcNow;
            var startDate = new DateTime(endDate.Year, endDate.Month, 1).AddMonths(-5);

            var transactions = await _context.Transactions
                .Where(t => t.UserId == userId && t.Date >= startDate && t.Date <= endDate)
                .ToListAsync(cancellationToken);

            var result = new List<CashflowDto>();

            for (int i = 0; i < 6; i++)
            {
                var monthDate = startDate.AddMonths(i);
                var monthTransactions = transactions
                    .Where(t => t.Date.Month == monthDate.Month && t.Date.Year == monthDate.Year)
                    .ToList();

                result.Add(new CashflowDto(
                    monthDate.ToString("MMM yyyy"),
                    monthTransactions.Where(t => t.Type == "income").Sum(t => t.Amount),
                    monthTransactions.Where(t => t.Type == "expense").Sum(t => t.Amount)
                ));
            }

            return result;
        }
    }
}
