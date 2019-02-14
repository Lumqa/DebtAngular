using DebtAngular.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DebtAngular.Data.Repositories.Abstract
{
    public interface IDebtRepo
    {
        DebtViewModel GetAll(string memberId);
    }
}
