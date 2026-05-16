using MediatR;
using Microsoft.EntityFrameworkCore;
using MoneyFlow.Application.Common.Interfaces;
using MoneyFlow.Domain.Entities;

namespace MoneyFlow.Application.Users.Commands.UpdatePermissions
{
    public class UpdatePermissionsCommand : IRequest<bool>
    {
        public string UserId { get; set; } = string.Empty;
        public List<ModulePermissionDto> Permissions { get; set; } = new();
    }

    public class ModulePermissionDto
    {
        public string Module { get; set; } = string.Empty;
        public bool CanView { get; set; }
        public bool CanCreate { get; set; }
        public bool CanEdit { get; set; }
        public bool CanDelete { get; set; }
    }

    public class UpdatePermissionsCommandHandler : IRequestHandler<UpdatePermissionsCommand, bool>
    {
        private readonly IApplicationDbContext _context;

        public UpdatePermissionsCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Handle(UpdatePermissionsCommand request, CancellationToken cancellationToken)
        {
            var existingPermissions = await _context.UserPermissions
                .Where(p => p.UserId == request.UserId)
                .ToListAsync(cancellationToken);

            foreach (var permDto in request.Permissions)
            {
                var existing = existingPermissions.FirstOrDefault(p => p.Module == permDto.Module);
                if (existing != null)
                {
                    existing.CanView = permDto.CanView;
                    existing.CanCreate = permDto.CanCreate;
                    existing.CanEdit = permDto.CanEdit;
                    existing.CanDelete = permDto.CanDelete;
                }
                else
                {
                    _context.UserPermissions.Add(new UserPermission
                    {
                        UserId = request.UserId,
                        Module = permDto.Module,
                        CanView = permDto.CanView,
                        CanCreate = permDto.CanCreate,
                        CanEdit = permDto.CanEdit,
                        CanDelete = permDto.CanDelete
                    });
                }
            }

            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
}
