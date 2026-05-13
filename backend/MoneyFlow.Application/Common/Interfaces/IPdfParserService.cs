using MoneyFlow.Application.Common.Models;

namespace MoneyFlow.Application.Common.Interfaces
{
    public interface IPdfParserService
    {
        List<ParsedTransaction> ParseStatement(Stream pdfStream);
    }
}
