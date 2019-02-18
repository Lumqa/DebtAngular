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

        [HttpPost]
        public IActionResult AddOrEditTask([FromBody] TaskModel taskModel)
        {
            if (ModelState.IsValid)
            {
                CalculateDebts(ref taskModel);
                _taskRepo.Save(taskModel, UserId);
                return RedirectToAction("Index");
            }
            return View(taskModel);
        }

        public void CalculateDebts(ref TaskModel taskModel)
        {
            List<MemberModel> memberList = taskModel.Members.ToList();

            Dictionary<string, double> creditors = new Dictionary<string, double>();
            Dictionary<string, double> debtors = new Dictionary<string, double>();
            foreach (var member in memberList)
            {
                double balance = member.Debt - member.Deposit;
                if (balance > 0)
                {
                    debtors.Add(member.Name, balance);
                }
                if (balance < 0)
                {
                    creditors.Add(member.Name, balance);
                }
            }

            List<DebtModel> debtsTable = new List<DebtModel>();

            var credCount = creditors.Count;

            for (int credIter = 0; credIter < credCount; credIter++)
            {
                double debt;
                var creditor = creditors.ElementAt(credIter);

                var debtorIter = 0;
                while (debtors.Count != 0)
                {
                    var debtor = debtors.ElementAt(debtorIter);
                    debt = Math.Min(Math.Abs(creditor.Value), debtor.Value);
                    debtors[debtor.Key] -= debt;
                    creditors[creditor.Key] += debt;

                    debtsTable.Add(new DebtModel
                    {
                        Id=Guid.Empty.ToString(),
                        Member1 = creditor.Key,
                        Member2 = debtor.Key,
                        Money = debt,
                        TaskId = taskModel.Id.ToString()
                    });

                    if (creditors[creditor.Key] == 0)
                    {
                        DeleteDebtors(ref debtors);
                        break;
                    }
                    debtorIter++;
                }
            }

            taskModel.Debts = debtsTable;
        }

        private void DeleteDebtors(ref Dictionary<string, double> debtors)
        {
            for (int debtIter = 0; debtIter < debtors.Count; debtIter++)
            {
                var debtor = debtors.ElementAt(debtIter);
                if (debtor.Value == 0)
                    debtors.Remove(debtor.Key);
                debtIter--;
            }
        }

        [HttpDelete("{id}")]
        public void Delete(string id)
        {
            _taskRepo.Delete(id);
        }
    }
}