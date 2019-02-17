using System;
using System.Collections.Generic;
using System.Linq;
using DebtAngular.Data.Repositories.Abstract;
using DebtAngular.Models;
using DebtAngular.Models.Mappings;
using Microsoft.EntityFrameworkCore;

namespace DebtAngular.Data.Repositories.Concrete
{
    public class TaskRepo : ITaskRepo
    {
        private readonly ApplicationDbContext _ctx;
        private IEnumerable<Task> Tasks => _ctx.Tasks.Include(m => m.Members).Include(d => d.Debts).ToList();
        public TaskRepo(ApplicationDbContext applicationDbContext)
        {
            _ctx = applicationDbContext;
        }

        public IEnumerable<TaskModel> GetAll(string userId)
        {

            var tasks = Tasks.Where(s => s.UserId == userId);
            List<TaskModel> taskModels = tasks.Select(t => t.Map()).ToList();
            return taskModels;
        }

        public TaskModel GetValue(Guid taskId)
        {
            var task = Tasks.First(t => t.Id == taskId);
            TaskModel taskModel = new TaskModel
            {
                Name = task.Name,
                Sum = task.Sum,
                Id = task.Id.ToString(),
                UserId = task.UserId,
                Members = task.Members.Select(m => m.Map()).ToList()
            };


            return taskModel;
        }

        public void Delete(string taskId)
        {
            var task = Tasks.FirstOrDefault(t => t.Id == Guid.Parse(taskId));
            _ctx.Tasks.Remove(task);
            _ctx.SaveChanges();
        }
        public void Save(Task task, string userid)
        {
            if (task.Id == Guid.Empty)
            {
                task.Id = Guid.NewGuid();
                task.UserId = userid;
                foreach (var member in task.Members)
                {
                    member.Id = Guid.NewGuid();
                }
                _ctx.Tasks.Add(task);
            }
            else
            {
                _ctx.Tasks.Update(task);
            }
            _ctx.SaveChanges();
        }
    }
}