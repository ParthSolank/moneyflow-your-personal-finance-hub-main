using MediatR;
using Microsoft.EntityFrameworkCore;
using MoneyFlow.Application.Common.Interfaces;

namespace MoneyFlow.Application.Accounts.Queries.GetAccounts
{
    public record AccountDto(Guid Id, string Name, string Type, decimal InitialBalance, decimal CurrentBalance);

    public record GetAccountsQuery : IRequest<List<AccountDto>>;

    public class GetAccountsQueryHandler : IRequestHandler<GetAccountsQuery, List<AccountDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;

        public GetAccountsQueryHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
        }

        public async Task<List<AccountDto>> Handle(GetAccountsQuery request, CancellationToken cancellationToken)
        {
            var userId = _currentUserService.UserId;

            var accounts = await _context.Accounts
                .Where(a => a.UserId == userId)
                .Select(a => new AccountDto(
                    a.Id,
                    a.Name,
                    a.Type,
                    a.InitialBalance,
                    a.InitialBalance + a.Transactions.Sum(t => t.Type == "income" ? t.Amount : -t.Amount)
                ))
                .ToListAsync(cancellationToken);

            return accounts;
        }
    }
}
