using MoneyFlow.Application.Common.Interfaces;
using MoneyFlow.Application.Common.Models;
using UglyToad.PdfPig;
using System.Text.RegularExpressions;
using System.Globalization;

namespace MoneyFlow.Infrastructure.Services
{
    public class PdfParserService : IPdfParserService
    {
        public List<ParsedTransaction> ParseStatement(Stream pdfStream)
        {
            var transactions = new List<ParsedTransaction>();
            using (var document = PdfDocument.Open(pdfStream))
            {
                foreach (var page in document.GetPages())
                {
                    var text = page.Text;
                    var lines = text.Split('\n');

                    foreach (var line in lines)
                    {
                        var parsed = TryParseLine(line);
                        if (parsed != null)
                        {
                            transactions.Add(parsed);
                        }
                    }
                }
            }
            return transactions;
        }

        private ParsedTransaction? TryParseLine(string line)
        {
            // Simple heuristic: Look for a date (DD/MM/YYYY or DD-MM-YYYY) and an amount
            // This is a simplified regex for common statement formats
            var dateRegex = new Regex(@"\d{2}[/-]\d{2}[/-]\d{4}");
            var amountRegex = new Regex(@"(\d{1,3}(,\d{3})*(\.\d{2})?)");

            var dateMatch = dateRegex.Match(line);
            if (!dateMatch.Success) return null;

            var amountMatches = amountRegex.Matches(line);
            if (amountMatches.Count == 0) return null;

            // Usually the last or second to last number is the transaction amount (vs balance)
            // This varies WILDLY by bank, so this is a "best effort" baseline
            var amountStr = amountMatches[^1].Value.Replace(",", "");
            if (!decimal.TryParse(amountStr, NumberStyles.Any, CultureInfo.InvariantCulture, out decimal amount))
                return null;

            // Extract description: everything between date and amount
            var description = line.Replace(dateMatch.Value, "").Replace(amountMatches[^1].Value, "").Trim();

            // Heuristic for type: if amount is large or has specific keywords
            // Real implementations use Credit/Debit columns
            var type = line.ToLower().Contains("cr") || line.ToLower().Contains("deposit") ? "income" : "expense";

            if (DateTime.TryParseExact(dateMatch.Value, new[] { "dd/MM/yyyy", "dd-MM-yyyy" }, CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime date))
            {
                return new ParsedTransaction(date, description, amount, type);
            }

            return null;
        }
    }
}
