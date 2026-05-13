using MediatR;
using Microsoft.EntityFrameworkCore;
using MoneyFlow.Application.Common.Interfaces;

namespace MoneyFlow.Application.Transactions.Commands.UpdateTransaction
{
    public record UpdateTransactionCommand(
        Guid Id,
        string Description,
        decimal Amount,
        DateTime Date,
        string Category,
        string Type,
        Guid AccountId
    ) : IRequest;

    public class UpdateTransactionCommandHandler : IRequestHandler<UpdateTransactionCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;

        public UpdateTransactionCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
        }

        public async Task Handle(UpdateTransactionCommand request, CancellationToken cancellationToken)
        {
            var userId = _currentUserService.UserId;

            var transaction = await _context.Transactions
                .FirstOrDefaultAsync(t => t.Id == request.Id && t.UserId == userId, cancellationToken);

            if (transaction == null)
            {
                throw new Exception("Transaction not found.");
            }

            transaction.Description = request.Description;
            transaction.Amount = request.Amount;
            transaction.Date = request.Date;
            transaction.Category = request.Category;
            transaction.Type = request.Type;
            transaction.AccountId = request.AccountId;

            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
