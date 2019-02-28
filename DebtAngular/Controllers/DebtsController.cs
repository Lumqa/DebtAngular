using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using DebtAngular.Data.Repositories.Abstract;
using DebtAngular.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DebtAngular.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class DebtsController : ControllerBase
    {

        private readonly IDebtRepo _debtRepo;
        private string UserId => User.FindFirst(ClaimTypes.NameIdentifier).Value;

        public DebtsController(IDebtRepo debtRepository)
        {
            _debtRepo = debtRepository;
        }

        [HttpGet]
        public DebtViewModel Get([FromQuery]string memberid)
        {
            return _debtRepo.GetAll(memberid);
        }

        [HttpGet("info")]
        public DebtViewModel Get()
        {
            return _debtRepo.GetFullInfo(UserId);
        }
    }
}