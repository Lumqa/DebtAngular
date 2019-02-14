using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using DebtAngular.Data.Repositories.Abstract;
using DebtAngular.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace DebtAngular.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TasksController : Controller
    {
        private readonly ITaskRepo _taskRepo;
        public string UserId => User.FindFirst(ClaimTypes.NameIdentifier).Value.ToString();

        public TasksController(ITaskRepo taskRepository)
        {
            _taskRepo = taskRepository;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Task>> Index()
        {
            string userId = User.FindFirst(ClaimTypes.NameIdentifier).Value.ToString();
            var tasks = _taskRepo.GetAll(userId).ToList();

            var res = JsonConvert.SerializeObject(tasks);
            return Ok(tasks);
        }

        [HttpGet("AddOrEditTask/{id}")]
        public IActionResult AddOrEditTask(Guid? id)
        {
            TaskModel task = new TaskModel
            {
                UserId = UserId,
                Members = new List<MemberModel>()
            };

            if (id != null)
            {
                task = _taskRepo.GetValue(id ?? Guid.Empty, UserId);
            }

            return Ok(task);
        }
    }
}