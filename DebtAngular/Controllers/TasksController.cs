using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using DebtAngular.Data.Repositories.Abstract;
using DebtAngular.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace DebtAngular.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TasksController : Controller
    {
        private readonly ITaskRepo _taskRepo;
        private string UserId => User.FindFirst(ClaimTypes.NameIdentifier).Value;

        public TasksController(ITaskRepo taskRepository)
        {
            _taskRepo = taskRepository;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Task>> Index()
        {
            var tasks = _taskRepo.GetAll(UserId).ToList();

            var res = JsonConvert.SerializeObject(tasks);
            return Ok(tasks);
        }

        [HttpGet("AddOrEditTask/{id?}")]
        public IActionResult AddOrEditTask(Guid? id)
        {
            TaskModel task = new TaskModel
            {
                UserId = UserId,
                Members = new List<MemberModel>()
            };

            if (id != null)
            {
                task = _taskRepo.GetValue((Guid) id);
            }

            return Ok(task);
        }

        [HttpDelete("{id}")]
        public void Delete(string id)
        {
            _taskRepo.Delete(id);
        }
        
      
        [HttpPost]
        public void Save([FromBody] Task task)
        {
            _taskRepo.Save(task, UserId);
        }
    }
}