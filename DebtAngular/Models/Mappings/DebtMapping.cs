using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DebtAngular.Models.Mappings
{
    public static class DebtMapping
    {
        public static DebtModel Map(this Debt debt)
        {
            return new DebtModel
            {
                Id = debt.Id.ToString(),
                Member1 = debt.Member1,
                Member2 = debt.Member2,
                Money = debt.Money,
                TaskId = debt.TaskId.ToString()
            };
        }

        public static Debt Map(this DebtModel debtModel)
        {
            return new Debt
            {
                Id = Guid.Parse(debtModel.Id),
                Member1 = debtModel.Member1,
                Member2 = debtModel.Member2,
                Money = debtModel.Money,
                TaskId = Guid.Parse(debtModel.TaskId)
            };
        }

        public static DebtModel Map(this FullDebtModel fullDebtModel)
        {
            return new DebtModel
            {
                Id = fullDebtModel.Id.FirstOrDefault(),
                Member1 = fullDebtModel.Member1,
                Member2 = fullDebtModel.Member2,
                Money = fullDebtModel.Money
            };
        }

        public static FullDebtModel FullDebtMap(this DebtModel debtModel)
        {
            return new FullDebtModel
            {
                Id = new List<string>() { debtModel.Id },
                Member1 = debtModel.Member1,
                Member2 = debtModel.Member2,
                Money = debtModel.Money
            };
        }
    }
}
