using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace DebtAngular.Models
{
    public class Member : CommonModel
    {
        public string Name { get; set; }
        public double Deposit { get; set; }
        public double Debt { get; set; }

        [ForeignKey("Task")]
        public Guid TaskId { get; set; }
        public virtual Task Task { get; set; }
    }
}
