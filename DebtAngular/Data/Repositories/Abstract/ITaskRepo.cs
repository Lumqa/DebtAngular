﻿using DebtAngular.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DebtAngular.Data.Repositories.Abstract
{
    public interface ITaskRepo
    {
        IEnumerable<TaskModel> GetAll(string userId);

        TaskModel GetValue(Guid taskId);
        void Delete(string taskId);
        void Save(Task task);
    }
}
