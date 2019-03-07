using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using DebtAngular.ValidationAttribute;

namespace DebtAngular.Models
{
    public class TaskModel
    {
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Field \"Name\" can't be empty")]
        public string Name { get; set; }
        [Required(ErrorMessage = "Field \"Sum\" can't be empty")]
        [Range(0, 10000000, ErrorMessage = "Min value is 0.")]
        [DepositSumCheck]
        [DebtSumCheck]
        public double? Sum { get; set; }

        public string UserId { get; set; }

        public List<MemberModel> Members { get; set; } = new List<MemberModel>();
        public List<DebtModel> Debts { get; set; } = new List<DebtModel>();
        public double? DepositsMember
        {
            get
            {
                double? sum = 0;
                foreach (var item in Members)
                {
                    sum += item.Deposit;
                }
                return sum;
            }

        }
        public double? DebtsMember
        {
            get
            {
                double? sum = 0;
                foreach (var item in Members)
                {
                    sum += item.Debt;
                }
                return sum;
            }

        }

    }

    public class MemberModel
    {
        public string Id { get; set; }
        [Required(ErrorMessage = "Field \"Name\" can't be empty")]
        public string Name { get; set; }
        [Required(ErrorMessage = "Field \"Deposit\" can't be empty")]
        [Range(0, 10000000, ErrorMessage = "Min value is 0.")]
        public double? Deposit { get; set; }
        [Required(ErrorMessage = "Field \"Debt\" can't be empty")]
        [Range(0, 10000000, ErrorMessage = "Min value is 0.")]
        public double? Debt { get; set; }

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
    public class FullDebtModel
    {
        public List<string> Id { get; set; }
        public string Member1 { get; set; }
        public string Member2 { get; set; }
        public double Money { get; set; }
    }


    public class DebtViewModel
    {
        public string Name { get; set; }
        public IEnumerable<DebtModel> Debts { get; set; }
    }

    public class DebtsFullInfoViewModel
    {
        public List<string> MemberNames { get; set; }
        public List<DebtModel> debts { get; set; }
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
