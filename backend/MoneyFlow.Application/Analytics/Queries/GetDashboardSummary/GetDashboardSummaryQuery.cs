using MediatR;
using Microsoft.EntityFrameworkCore;
using MoneyFlow.Application.Common.Interfaces;

namespace MoneyFlow.Application.Analytics.Queries.GetDashboardSummary
{
    public record DashboardSummaryDto(
        decimal TotalBalance, 
        decimal MonthlyIncome, 
        decimal MonthlyExpense, 
        decimal SavingsRate
    );

    public record GetDashboardSummaryQuery : IRequest<DashboardSummaryDto>;

    public class GetDashboardSummaryQueryHandler : IRequestHandler<GetDashboardSummaryQuery, DashboardSummaryDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;

        public GetDashboardSummaryQueryHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
        }

        public async Task<DashboardSummaryDto> Handle(GetDashboardSummaryQuery request, CancellationToken cancellationToken)
        {
            var userId = _currentUserService.UserId;
            var now = DateTime.UtcNow;

            // 1. Total Balance (Accounts)
            var accounts = await _context.Accounts
                .Where(a => a.UserId == userId)
                .ToListAsync(cancellationToken);
            
            var accountIds = accounts.Select(a => a.Id).ToList();
            var totalInitialBalance = accounts.Sum(a => a.InitialBalance);

            var totalTransactions = await _context.Transactions
                .Where(t => accountIds.Contains(t.AccountId))
                .SumAsync(t => t.Type == "income" ? t.Amount : -t.Amount, cancellationToken);

            var totalBalance = totalInitialBalance + totalTransactions;

            // 2. Monthly Income/Expense
            var monthlyTransactions = await _context.Transactions
                .Where(t => t.UserId == userId && t.Date.Month == now.Month && t.Date.Year == now.Year)
                .ToListAsync(cancellationToken);

            var monthlyIncome = monthlyTransactions.Where(t => t.Type == "income").Sum(t => t.Amount);
            var monthlyExpense = monthlyTransactions.Where(t => t.Type == "expense").Sum(t => t.Amount);

            // 3. Savings Rate
            decimal savingsRate = 0;
            if (monthlyIncome > 0)
            {
                savingsRate = Math.Round(((monthlyIncome - monthlyExpense) / monthlyIncome) * 100, 1);
            }

            return new DashboardSummaryDto(totalBalance, monthlyIncome, monthlyExpense, savingsRate);
        }
    }
}
