using MediatR;
using Microsoft.EntityFrameworkCore;
using MoneyFlow.Application.Common.Interfaces;
using MoneyFlow.Domain.Entities;

namespace MoneyFlow.Application.Budgets.Commands.UpsertBudget
{
    public record UpsertBudgetCommand(string Category, decimal Amount, int Month, int Year) : IRequest<Guid>;

    public class UpsertBudgetCommandHandler : IRequestHandler<UpsertBudgetCommand, Guid>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;

        public UpsertBudgetCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
        }

        public async Task<Guid> Handle(UpsertBudgetCommand request, CancellationToken cancellationToken)
        {
            var userId = _currentUserService.UserId;

            var entity = await _context.Budgets
                .FirstOrDefaultAsync(b => b.UserId == userId && 
                                          b.Category == request.Category && 
                                          b.Month == request.Month && 
                                          b.Year == request.Year, cancellationToken);

            if (entity == null)
            {
                entity = new Budget
                {
                    Category = request.Category,
                    Amount = request.Amount,
                    Month = request.Month,
                    Year = request.Year,
                    UserId = userId!
                };
                _context.Budgets.Add(entity);
            }
            else
            {
                entity.Amount = request.Amount;
            }

            await _context.SaveChangesAsync(cancellationToken);

            return entity.Id;
        }
    }
}
