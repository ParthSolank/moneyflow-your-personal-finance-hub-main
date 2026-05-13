using MoneyFlow.Domain.Common;

namespace MoneyFlow.Domain.Entities
{
    public class Account : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // Savings, Credit, Cash, etc.
        public decimal InitialBalance { get; set; }
        public string UserId { get; set; } = string.Empty;
        public ApplicationUser? User { get; set; }
        
        public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
    }
}
