using MediatR;
using Microsoft.EntityFrameworkCore;
using MoneyFlow.Application.Common.Interfaces;

namespace MoneyFlow.Application.Budgets.Queries.GetBudgets
{
    public record BudgetDto(string Category, decimal Limit, decimal Actual, int Month, int Year);

    public record GetBudgetsQuery(int Month, int Year) : IRequest<List<BudgetDto>>;

    public class GetBudgetsQueryHandler : IRequestHandler<GetBudgetsQuery, List<BudgetDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;

        public GetBudgetsQueryHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
        }

        public async Task<List<BudgetDto>> Handle(GetBudgetsQuery request, CancellationToken cancellationToken)
        {
            var userId = _currentUserService.UserId;

            // Get budgets set by the user
            var budgets = await _context.Budgets
                .Where(b => b.UserId == userId && b.Month == request.Month && b.Year == request.Year)
                .ToListAsync(cancellationToken);

            // Get actual spending per category for the specified month
            var actualSpending = await _context.Transactions
                .Where(t => t.UserId == userId && 
                            t.Type == "expense" && 
                            t.Date.Month == request.Month && 
                            t.Date.Year == request.Year)
                .GroupBy(t => t.Category)
                .Select(g => new { Category = g.Key, Total = g.Sum(t => t.Amount) })
                .ToListAsync(cancellationToken);

            // Merge them
            var result = budgets.Select(b => new BudgetDto(
                b.Category,
                b.Amount,
                actualSpending.FirstOrDefault(s => s.Category == b.Category)?.Total ?? 0,
                b.Month,
                b.Year
            )).ToList();

            // Add categories that have spending but no budget set
            var categoriesWithBudget = budgets.Select(b => b.Category).ToList();
            var overspentWithoutBudget = actualSpending
                .Where(s => !categoriesWithBudget.Contains(s.Category))
                .Select(s => new BudgetDto(s.Category, 0, s.Total, request.Month, request.Year));

            result.AddRange(overspentWithoutBudget);

            return result;
        }
    }
}
