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
    public class TasksController : ControllerBase
    {
        private readonly ITaskRepo _taskRepo;

        public TasksController(ITaskRepo taskRepository)
        {
            _taskRepo = taskRepository;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Task>> Get()
        {
            string userId = User.FindFirst(ClaimTypes.NameIdentifier).Value.ToString();
            var tasks = _taskRepo.GetAll(userId).ToList();

            var res = JsonConvert.SerializeObject(tasks);
            return Ok(tasks);
        }
    }
}