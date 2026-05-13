using MediatR;
using Microsoft.EntityFrameworkCore;
using MoneyFlow.Application.Common.Interfaces;

namespace MoneyFlow.Application.Analytics.Queries.GetSpendingByCategory
{
    public record CategorySpendingDto(string Category, decimal Amount);

    public record GetSpendingByCategoryQuery(int Month, int Year) : IRequest<List<CategorySpendingDto>>;

    public class GetSpendingByCategoryQueryHandler : IRequestHandler<GetSpendingByCategoryQuery, List<CategorySpendingDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;

        public GetSpendingByCategoryQueryHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
        }

        public async Task<List<CategorySpendingDto>> Handle(GetSpendingByCategoryQuery request, CancellationToken cancellationToken)
        {
            var userId = _currentUserService.UserId;

            var transactions = await _context.Transactions
                .Where(t => t.UserId == userId && 
                            t.Type == "expense" && 
                            t.Date.Month == request.Month && 
                            t.Date.Year == request.Year)
                .ToListAsync(cancellationToken);

            return transactions
                .GroupBy(t => t.Category)
                .Select(g => new CategorySpendingDto(g.Key, g.Sum(t => t.Amount)))
                .OrderByDescending(x => x.Amount)
                .ToList();
        }
    }
}
