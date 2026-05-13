using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using MoneyFlow.Application.Transactions.Commands.ParseStatement;
using MoneyFlow.Application.Transactions.Commands.ConfirmImport;
using MoneyFlow.Application.Common.Models;

namespace MoneyFlow.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ImportController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ImportController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("parse")]
        public async Task<ActionResult<List<ParsedTransaction>>> Parse(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            using (var stream = file.OpenReadStream())
            {
                return await _mediator.Send(new ParseStatementCommand(stream));
            }
        }

        [HttpPost("confirm")]
        public async Task<ActionResult<int>> Confirm(ConfirmImportCommand command)
        {
            return await _mediator.Send(command);
        }
    }
}
