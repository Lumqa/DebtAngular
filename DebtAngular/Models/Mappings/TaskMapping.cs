using System.Linq;

namespace DebtAngular.Models.Mappings
{
    public static class TaskMapping
    {
        public static TaskModel Map(this Task task)
        {
            return new TaskModel
            {
                Id = task.Id,
                Name = task.Name,
                Sum = task.Sum,
                UserId = task.UserId,
                Members = task.Members.Select(m => m.Map()).ToList(),
                Debts = task.Debts.Select(d => d.Map()).ToList()
            };
        }
    }
}
