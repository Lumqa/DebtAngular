using DebtAngular.Models;
using System;
using System.ComponentModel.DataAnnotations;

namespace DebtAngular.ValidationAttribute
{
    [AttributeUsage(AttributeTargets.Property)]
    public class DebtSumCheckAttribute : CompareAttribute
    {
        private static readonly string property = "DebtsMember";
        public DebtSumCheckAttribute() : base(property) { }

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {

            var otherValue = ((TaskModel)validationContext.ObjectInstance).DebtsMember;
            return (double?)value != (double?)otherValue ? new ValidationResult("Sum of debts not equal Sum") : null;

        }
    }
}