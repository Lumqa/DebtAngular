using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DebtAngular.Models
{
    public class Task : CommonModel
    {
        public string Name { get; set; }
        public double Sum { get; set; }

        public string UserId { get; set; }

        public virtual ICollection<Member> Members { get; set; }
        public virtual ICollection<Debt> Debts { get; set; }
    }
}
