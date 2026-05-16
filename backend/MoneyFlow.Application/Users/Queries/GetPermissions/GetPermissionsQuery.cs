using MediatR;
using Microsoft.EntityFrameworkCore;
using MoneyFlow.Application.Common.Interfaces;
using MoneyFlow.Application.Users.Commands.UpdatePermissions;

namespace MoneyFlow.Application.Users.Queries.GetPermissions
{
    public class GetPermissionsQuery : IRequest<List<ModulePermissionDto>>
    {
        public string UserId { get; set; } = string.Empty;
    }

    public class GetPermissionsQueryHandler : IRequestHandler<GetPermissionsQuery, List<ModulePermissionDto>>
    {
        private readonly IApplicationDbContext _context;

        public GetPermissionsQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<ModulePermissionDto>> Handle(GetPermissionsQuery request, CancellationToken cancellationToken)
        {
            var permissions = await _context.UserPermissions
                .Where(p => p.UserId == request.UserId)
                .Select(p => new ModulePermissionDto
                {
                    Module = p.Module,
                    CanView = p.CanView,
                    CanCreate = p.CanCreate,
                    CanEdit = p.CanEdit,
                    CanDelete = p.CanDelete
                })
                .ToListAsync(cancellationToken);

            return permissions;
        }
    }
}
