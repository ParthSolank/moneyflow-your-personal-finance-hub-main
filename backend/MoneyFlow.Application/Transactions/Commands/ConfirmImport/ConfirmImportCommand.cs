using MediatR;
using MoneyFlow.Application.Common.Interfaces;
using MoneyFlow.Application.Common.Models;
using MoneyFlow.Domain.Entities;

namespace MoneyFlow.Application.Transactions.Commands.ConfirmImport
{
    public record ImportTransactionDto(DateTime Date, string Description, decimal Amount, string Type, string Category);
    
    public record ConfirmImportCommand(Guid AccountId, List<ImportTransactionDto> Transactions) : IRequest<int>;

    public class ConfirmImportCommandHandler : IRequestHandler<ConfirmImportCommand, int>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;

        public ConfirmImportCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
        }

        public async Task<int> Handle(ConfirmImportCommand request, CancellationToken cancellationToken)
        {
            var userId = _currentUserService.UserId!;
            
            var entities = request.Transactions.Select(t => new Transaction
            {
                AccountId = request.AccountId,
                UserId = userId,
                Description = t.Description,
                Amount = t.Amount,
                Date = t.Date,
                Category = t.Category,
                Type = t.Type
            }).ToList();

            _context.Transactions.AddRange(entities);
            return await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
