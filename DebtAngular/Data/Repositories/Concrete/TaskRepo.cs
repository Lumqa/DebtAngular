using DebtAngular.Data.Repositories.Abstract;
using DebtAngular.Models;
using DebtAngular.Models.Mappings;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace DebtAngular.Data.Repositories.Concrete
{
    public class TaskRepo:ITaskRepo
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
    }
}
