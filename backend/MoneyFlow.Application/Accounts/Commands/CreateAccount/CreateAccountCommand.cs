using MediatR;
using MoneyFlow.Application.Common.Interfaces;
using MoneyFlow.Domain.Entities;

namespace MoneyFlow.Application.Accounts.Commands.CreateAccount
{
    public record CreateAccountCommand(string Name, string Type, decimal InitialBalance) : IRequest<Guid>;

    public class CreateAccountCommandHandler : IRequestHandler<CreateAccountCommand, Guid>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;

        public CreateAccountCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
        }

        public async Task<Guid> Handle(CreateAccountCommand request, CancellationToken cancellationToken)
        {
            var entity = new Account
            {
                Name = request.Name,
                Type = request.Type,
                InitialBalance = request.InitialBalance,
                UserId = _currentUserService.UserId!
            };

            _context.Accounts.Add(entity);
            await _context.SaveChangesAsync(cancellationToken);

            return entity.Id;
        }
    }
}
