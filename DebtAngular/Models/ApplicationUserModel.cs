using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DebtAngular.Models
{
    public class ApplicationUserModel
    {
        [Required]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
    }

    public class ResultModel
    {
        public bool ResultStatus { get; set; }
        public string Token { get; set; }
    }
}
