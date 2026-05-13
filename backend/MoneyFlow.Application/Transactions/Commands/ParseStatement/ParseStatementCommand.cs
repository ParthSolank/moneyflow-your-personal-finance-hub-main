using MediatR;
using MoneyFlow.Application.Common.Interfaces;
using MoneyFlow.Application.Common.Models;

namespace MoneyFlow.Application.Transactions.Commands.ParseStatement
{
    public record ParseStatementCommand(Stream PdfStream) : IRequest<List<ParsedTransaction>>;

    public class ParseStatementCommandHandler : IRequestHandler<ParseStatementCommand, List<ParsedTransaction>>
    {
        private readonly IPdfParserService _pdfParserService;

        public ParseStatementCommandHandler(IPdfParserService pdfParserService)
        {
            _pdfParserService = pdfParserService;
        }

        public async Task<List<ParsedTransaction>> Handle(ParseStatementCommand request, CancellationToken cancellationToken)
        {
            // Note: Since PdfPig works synchronously, we just run it. 
            // In a real app with large files, we might use Task.Run for this.
            return await Task.FromResult(_pdfParserService.ParseStatement(request.PdfStream));
        }
    }
}
