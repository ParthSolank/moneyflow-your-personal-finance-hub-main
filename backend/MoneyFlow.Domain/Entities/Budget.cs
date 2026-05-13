using MoneyFlow.Domain.Common;

namespace MoneyFlow.Domain.Entities
{
    public class Budget : BaseEntity
    {
        public string Category { get; set; } = string.Empty;
        public decimal Amount { get; set; } // The limit
        public int Month { get; set; }
        public int Year { get; set; }
        
        public string UserId { get; set; } = string.Empty;
        public ApplicationUser? User { get; set; }
    }
}
