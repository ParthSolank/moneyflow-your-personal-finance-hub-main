using MediatR;
using Microsoft.EntityFrameworkCore;
using MoneyFlow.Application.Common.Interfaces;

namespace MoneyFlow.Application.Accounts.Commands.DeleteAccount
{
    public record DeleteAccountCommand(Guid Id) : IRequest<Unit>;

    public class DeleteAccountCommandHandler : IRequestHandler<DeleteAccountCommand, Unit>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;

        public DeleteAccountCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
        }

        public async Task<Unit> Handle(DeleteAccountCommand request, CancellationToken cancellationToken)
        {
            var userId = _currentUserService.UserId;
            var entity = await _context.Accounts
                .Where(a => a.UserId == userId)
                .FirstOrDefaultAsync(a => a.Id == request.Id, cancellationToken);

            if (entity == null)
            {
                throw new Exception("Account not found or access denied.");
            }

            _context.Accounts.Remove(entity);
            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
