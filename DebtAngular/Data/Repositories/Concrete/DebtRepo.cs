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
            var taskId = ctx.Members.Where(m => m.Id == Guid.Parse(memberId)).Select(t => t.TaskId).FirstOrDefault();

            var debtModel = new DebtViewModel
            {
                Name = memberName,
                Debts = Debts.Where(d => (d.Member1 == memberName || d.Member2 == memberName) && d.TaskId == taskId).Select(d => d.Map()).ToList()
            };

            return debtModel;
        }

        public DebtViewModel GetFullInfo(string userId)
        {
            var membersName = ctx.Members.Where(d => d.Task.UserId == userId).Select(m=>m.Name).Distinct().ToList();
            var debts = ctx.Debts.Where(d => d.Task.UserId == userId).Select(dm=>dm.Map()).ToList();

            foreach(var member in membersName)
            {
                var debtForMember = debts.Where(m => m.Member1 == member || m.Member2 == member).ToList();


            }
            return new DebtViewModel { Debts = debts };
        }

    }
}
