using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DebtAngular.Models.Mappings
{
    public static class MemberMapping
    {
        public static MemberModel Map(this Member member)
        {
            return new MemberModel
            {
                Id = member.Id.ToString(),
                Name = member.Name,
                Deposit = member.Deposit,
                Debt = member.Debt,
                TaskId = member.TaskId.ToString()
            };
        }

        public static Member Map(this MemberModel memberModel)
        {
            return new Member
            {
                Id = Guid.Parse(memberModel.Id),
                Name = memberModel.Name,
                Deposit = memberModel.Deposit,
                Debt = memberModel.Debt,
                TaskId = Guid.Parse(memberModel.TaskId)
            };
        }
    }
}
