using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Threading.Tasks;

namespace DebtAngular.Models
{
    public class Debt : CommonModel
    {
        public string Member1 { get; set; }
        public string Member2 { get; set; }
        public double Money { get; set; }

        [ForeignKey("Task")]
        public Guid TaskId { get; set; }
        public virtual Task Task { get; set; }
    }
}
