using Microsoft.EntityFrameworkCore;
using MoneyFlow.Domain.Entities;

namespace MoneyFlow.Application.Common.Interfaces
{
    public interface IApplicationDbContext
    {
        DbSet<Account> Accounts { get; }
        DbSet<Transaction> Transactions { get; }
        DbSet<Budget> Budgets { get; }
        DbSet<UserPermission> UserPermissions { get; }
        
        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}
