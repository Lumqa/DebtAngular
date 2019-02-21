using System;
using System.Collections.Generic;
using System.Linq;
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

        public DebtsController(IDebtRepo debtRepository)
        {
            _debtRepo = debtRepository;
        }

        [HttpGet]
        public DebtViewModel Get([FromQuery]string memberid)
        //public ActionResult<DebtModel> Get(params string[] val)
        {
            return _debtRepo.GetAll(memberid);
        }
    }
}