using Api.Data;
using Api.Models;

namespace Api.Controllers;

public class TaskController(AppDbContext context) : BaseController<TaskItem>(context)
{
}
