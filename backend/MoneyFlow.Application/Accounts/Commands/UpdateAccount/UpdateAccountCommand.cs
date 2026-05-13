using MediatR;
using Microsoft.EntityFrameworkCore;
using MoneyFlow.Application.Common.Interfaces;

namespace MoneyFlow.Application.Accounts.Commands.UpdateAccount
{
    public record UpdateAccountCommand(Guid Id, string Name) : IRequest<Unit>;

    public class UpdateAccountCommandHandler : IRequestHandler<UpdateAccountCommand, Unit>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;

        public UpdateAccountCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
        }

        public async Task<Unit> Handle(UpdateAccountCommand request, CancellationToken cancellationToken)
        {
            var userId = _currentUserService.UserId;
            var entity = await _context.Accounts
                .Where(a => a.UserId == userId)
                .FirstOrDefaultAsync(a => a.Id == request.Id, cancellationToken);

            if (entity == null)
            {
                throw new Exception("Account not found or access denied.");
            }

            entity.Name = request.Name;
            
            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
