namespace MoneyFlow.Application.Common.Models
{
    public record ParsedTransaction(DateTime Date, string Description, decimal Amount, string Type);
}
