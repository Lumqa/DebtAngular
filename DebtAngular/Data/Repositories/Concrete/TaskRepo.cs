using DebtAngular.Data.Repositories.Abstract;
using DebtAngular.Models;
using DebtAngular.Models.Mappings;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DebtAngular.Data.Repositories.Concrete
{
    public class TaskRepo : ITaskRepo
    {
        private readonly ApplicationDbContext ctx;
        private IEnumerable<Task> Tasks => ctx.Tasks.Include(m => m.Members).Include(d => d.Debts).ToList();

        public TaskRepo(ApplicationDbContext applicationDbContext)
        {
            ctx = applicationDbContext;
        }

        public IEnumerable<TaskModel> GetAll(string userId)
        {

            var tasks = Tasks.Where(s => s.UserId == userId);
            List<TaskModel> taskModels = tasks.Select(t => t.Map()).ToList();
            return taskModels;
        }

        public TaskModel GetValue(Guid taskId)
        {
            var task = Tasks.Where(t => t.Id == taskId).First();
            TaskModel taskModel = new TaskModel
            {
                Name = task.Name,
                Sum = task.Sum,
                Id = task.Id.ToString(),
                UserId = task.UserId
            };

            taskModel.Members = task.Members.Select(m => m.Map()).ToList();

            return taskModel;
        }

        public void Delete(string taskId)
        {
            var task = Tasks.Where(t => t.Id == Guid.Parse(taskId)).FirstOrDefault();
            ctx.Tasks.Remove(task);
            ctx.SaveChanges();
        }

        public void Save(Task task)
        {
            ctx.Tasks.Add(task);
            ctx.SaveChanges();
        }
    }
}