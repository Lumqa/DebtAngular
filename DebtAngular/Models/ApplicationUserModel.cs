using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;

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
        public string email { get; set; }
        public string Token { get; set; }
    }

    public class TaskResultModel
    {
        public bool ResultStatus { get; set; }
        public List<Task> Tasks { get; set; }
    }

}
