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

        public TaskModel GetValue(int taskId, string userId)
        {
            try { 

                var task = Tasks.Where(t => t.UserId == userId).ElementAt(taskId-1);
                TaskModel taskModel = new TaskModel
                {
                    Name = task.Name,
                    Sum = task.Sum,
                    Id = task.Id,
                    UserId = task.UserId,
                    Members = task.Members.Select(m => m.Map()).ToList(),
                    Debts = task.Debts.Select(d=>d.Map()).ToList()
                };
                return taskModel;
            }
            catch (Exception e)
            {
                return null;
            }
        }

        public void Delete(string taskId)
        {
            var task = Tasks.FirstOrDefault(t => t.Id == Guid.Parse(taskId));
            _ctx.Tasks.Remove(task);
            _ctx.SaveChanges();
        }

        public void Save(TaskModel taskModel, string userid)
        {
            Task task = new Task
            {
                Id = taskModel.Id,
                Name = taskModel.Name,
                Sum = taskModel.Sum,
                UserId = taskModel.UserId,
                Members = taskModel.Members.Select(e => e.Map()).ToList(),
                Debts = taskModel.Debts.Select(e => e.Map()).ToList()
            };

            var listMembersIdForDel = _ctx.Members.Where(t => t.TaskId == task.Id).Except(taskModel.Members.Select(e => e.Map()));
            var listDebtsIdForDel = _ctx.Debts.Where(t => t.TaskId == task.Id).Except(taskModel.Debts.Select(d => d.Map()));

            foreach (var item in listMembersIdForDel)
            {
                _ctx.Members.Remove(item);
            }

            foreach (var item in listDebtsIdForDel)
            {
                _ctx.Debts.Remove(item);
            }

            if (task.Id == Guid.Empty)
            {
                task.Id = Guid.NewGuid();
                task.UserId = userid;
                foreach (var member in task.Members)
                {
                    member.TaskId = task.Id;
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