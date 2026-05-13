using MediatR;
using MoneyFlow.Application.Common.Interfaces;
using MoneyFlow.Domain.Entities;

namespace MoneyFlow.Application.Transactions.Commands.CreateTransaction
{
    public record CreateTransactionCommand(
        string Description, 
        decimal Amount, 
        DateTime Date, 
        string Category, 
        string Type, 
        Guid AccountId
    ) : IRequest<Guid>;

    public class CreateTransactionCommandHandler : IRequestHandler<CreateTransactionCommand, Guid>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;

        public CreateTransactionCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
        }

        public async Task<Guid> Handle(CreateTransactionCommand request, CancellationToken cancellationToken)
        {
            var entity = new Transaction
            {
                Description = request.Description,
                Amount = request.Amount,
                Date = request.Date,
                Category = request.Category,
                Type = request.Type,
                AccountId = request.AccountId,
                UserId = _currentUserService.UserId!
            };

            _context.Transactions.Add(entity);
            await _context.SaveChangesAsync(cancellationToken);

            return entity.Id;
        }
    }
}
