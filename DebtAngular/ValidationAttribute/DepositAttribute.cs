using DebtAngular.Models;
using System;
using System.ComponentModel.DataAnnotations;

namespace DebtAngular.ValidationAttribute
{
    [AttributeUsage(AttributeTargets.Property)]
    public class DepositSumCheckAttribute : CompareAttribute
    {
        private static readonly string property = "DepositsMember";
        public DepositSumCheckAttribute() : base(property) { }

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            var otherValue = ((TaskModel)validationContext.ObjectInstance).DepositsMember;
            return (double?)value != (double?)otherValue ? new ValidationResult("Sum of deposits not equal Sum") : ValidationResult.Success;

        }
    }
}