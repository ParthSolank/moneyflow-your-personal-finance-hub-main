using MoneyFlow.Domain.Common;

namespace MoneyFlow.Domain.Entities
{
    public class Transaction : BaseEntity
    {
        public string Description { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public string Category { get; set; } = "Other";
        public string Type { get; set; } = "expense"; // income, expense
        
        public Guid AccountId { get; set; }
        public Account? Account { get; set; }
        
        public string UserId { get; set; } = string.Empty;
        public ApplicationUser? User { get; set; }
    }
}
