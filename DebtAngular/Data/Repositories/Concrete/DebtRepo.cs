using DebtAngular.Data.Repositories.Abstract;
using DebtAngular.Models;
using DebtAngular.Models.Mappings;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DebtAngular.Data.Repositories.Concrete
{
    public class DebtRepo : IDebtRepo
    {
        private readonly ApplicationDbContext ctx;
        public IEnumerable<Debt> Debts => ctx.Debts.Include(m => m.Task).ToList();

        public DebtRepo(ApplicationDbContext applicationDbContext)
        {
            ctx = applicationDbContext;
        }

        public DebtViewModel GetAll(string memberId)
        {
            //get needed member
            var memberName = ctx.Members.Where(m => m.Id == Guid.Parse(memberId)).Select(m=>m.Name).FirstOrDefault();
            var debtModel = new DebtViewModel
            {
                Name = memberName,
                Debts = Debts.Where(d => d.Member1 == memberName || d.Member2 == memberName).Select(d => d.Map()).ToList()
            };

            return debtModel;
        }
    }
}
