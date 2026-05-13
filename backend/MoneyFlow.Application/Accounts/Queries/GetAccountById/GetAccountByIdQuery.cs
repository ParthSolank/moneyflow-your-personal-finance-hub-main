using MediatR;
using Microsoft.EntityFrameworkCore;
using MoneyFlow.Application.Common.Interfaces;
using MoneyFlow.Application.Accounts.Queries.GetAccounts;

namespace MoneyFlow.Application.Accounts.Queries.GetAccountById
{
    public record GetAccountByIdQuery(Guid Id) : IRequest<AccountDto>;

    public class GetAccountByIdQueryHandler : IRequestHandler<GetAccountByIdQuery, AccountDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;

        public GetAccountByIdQueryHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
        }

        public async Task<AccountDto> Handle(GetAccountByIdQuery request, CancellationToken cancellationToken)
        {
            var userId = _currentUserService.UserId;

            var account = await _context.Accounts
                .Where(a => a.UserId == userId && a.Id == request.Id)
                .Select(a => new AccountDto(
                    a.Id,
                    a.Name,
                    a.Type,
                    a.InitialBalance,
                    a.InitialBalance + a.Transactions.Sum(t => t.Type == "income" ? t.Amount : -t.Amount)
                ))
                .FirstOrDefaultAsync(cancellationToken);

            if (account == null)
            {
                throw new Exception("Account not found.");
            }

            return account;
        }
    }
}
