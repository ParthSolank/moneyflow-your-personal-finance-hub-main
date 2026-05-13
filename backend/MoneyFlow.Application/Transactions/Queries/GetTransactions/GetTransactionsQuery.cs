using MediatR;
using Microsoft.EntityFrameworkCore;
using MoneyFlow.Application.Common.Interfaces;

namespace MoneyFlow.Application.Transactions.Queries.GetTransactions
{
    public record TransactionDto(Guid Id, string Description, decimal Amount, DateTime Date, string Category, string Type, Guid AccountId, string AccountName);

    public record GetTransactionsQuery(
        DateTime? FromDate = null,
        DateTime? ToDate = null,
        string? Category = null,
        Guid? AccountId = null,
        string? Type = null
    ) : IRequest<List<TransactionDto>>;

    public class GetTransactionsQueryHandler : IRequestHandler<GetTransactionsQuery, List<TransactionDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;

        public GetTransactionsQueryHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
        }

        public async Task<List<TransactionDto>> Handle(GetTransactionsQuery request, CancellationToken cancellationToken)
        {
            var userId = _currentUserService.UserId;

            var query = _context.Transactions
                .Include(t => t.Account)
                .Where(t => t.UserId == userId);

            if (request.FromDate.HasValue)
                query = query.Where(t => t.Date >= request.FromDate.Value);
            
            if (request.ToDate.HasValue)
                query = query.Where(t => t.Date <= request.ToDate.Value);

            if (!string.IsNullOrEmpty(request.Category))
                query = query.Where(t => t.Category == request.Category);

            if (request.AccountId.HasValue)
                query = query.Where(t => t.AccountId == request.AccountId.Value);

            if (!string.IsNullOrEmpty(request.Type))
                query = query.Where(t => t.Type == request.Type);

            return await query
                .OrderByDescending(t => t.Date)
                .Select(t => new TransactionDto(
                    t.Id,
                    t.Description,
                    t.Amount,
                    t.Date,
                    t.Category,
                    t.Type,
                    t.AccountId,
                    t.Account!.Name
                ))
                .ToListAsync(cancellationToken);
        }
    }
}
