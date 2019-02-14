using DebtAngular.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DebtAngular.Data.Repositories.Abstract
{
    public interface ITaskRepo
    {
        IEnumerable<Task> GetAll(string userId);
    }
}
