using System;
using System.Collections.Generic;
using System.Linq;

namespace DebtAngular.Models
{
    public class TaskModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public double Sum { get; set; }

        public string UserId { get; set; }

        public List<MemberModel> Members { get; set; } = new List<MemberModel>();
        public List<DebtModel> Debts { get; set; } = new List<DebtModel>();
    }

    public class MemberModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public double Deposit { get; set; }
        public double Debt { get; set; }

        public string TaskId { get; set; }
    }

    public class DebtModel
    {
        public string Id { get; set; }
        public string Member1 { get; set; }
        public string Member2 { get; set; }
        public double Money { get; set; }

        public string TaskId { get; set; }
    }


    public class DebtViewModel
    {
        public string Name { get; set; }
        public IEnumerable<DebtModel> Debts { get; set; }
    }

}


//public class Task : CommonModel
//{
//    public string Name { get; set; }
//    public double Sum { get; set; }

//    public string UserId { get; set; }

//    public virtual ICollection<Member> Members { get; set; }
//    public virtual ICollection<Debt> Debts { get; set; }
//}

//public class Member : CommonModel
//{
//    public string Name { get; set; }
//    public double Deposit { get; set; }
//    public double Debt { get; set; }

//    [ForeignKey("Task")]
//    public Guid TaskId { get; set; }
//    public virtual Task Task { get; set; }
//}

//public class Debt : CommonModel
//{
//    public string Member1 { get; set; }
//    public string Member2 { get; set; }
//    public double Money { get; set; }

//    [ForeignKey("Task")]
//    public Guid TaskId { get; set; }
//    public virtual Task Task { get; set; }
//}
