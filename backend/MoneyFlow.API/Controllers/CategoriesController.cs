using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MoneyFlow.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        [HttpGet]
        public ActionResult<List<string>> GetCategories()
        {
            var categories = new List<string>
            {
                "Salary",
                "Rent",
                "Food",
                "Food & Dining",
                "Utilities",
                "Shopping",
                "Freelance",
                "Entertainment",
                "Groceries",
                "Transport",
                "Other"
            };

            return Ok(categories);
        }
    }
}
