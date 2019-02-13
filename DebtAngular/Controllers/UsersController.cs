using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using DebtAngular.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace DebtAngular.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private UserManager<IdentityUser> _userManager;
        private SignInManager<IdentityUser> _signInManager;
        private readonly IConfiguration _configuration;

        public UsersController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
        }

        [HttpPost]
        public async Task<Object> Register(ApplicationUserModel applicationUserModel)
        {
            var user = new IdentityUser()
            {
                UserName = applicationUserModel.Email,
                Email = applicationUserModel.Email
            };

            try
            {
                var result = await _userManager.CreateAsync(user, applicationUserModel.Password);
                if (result.Succeeded)
                {
                    await _signInManager.SignInAsync(user, false);
                    var resultModel = new ResultModel();
                    resultModel.ResultStatus = result.Succeeded;
                    resultModel.Token = (string)(await GenerateJwtToken(applicationUserModel.Email, user));

                    return Ok(resultModel);
                }

                return Ok(result);
                //throw new ApplicationException("UNKNOWN_ERROR");
                //return Ok(result);
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        [HttpPost]
        public async Task<object> Login( [FromBody] ApplicationUserModel applicationUserModel)
        {
            var result = await _signInManager.PasswordSignInAsync(applicationUserModel.Email, applicationUserModel.Password, false, false);
            var resultModel = new ResultModel();
            if (result.Succeeded)
            {
                var appUser = _userManager.Users.SingleOrDefault(r => r.Email == applicationUserModel.Email);
                resultModel.ResultStatus = result.Succeeded;
                resultModel.Token = (string)(await GenerateJwtToken(applicationUserModel.Email, appUser));
                return Ok(resultModel);
            }
            else
            {
                resultModel.ResultStatus = result.IsNotAllowed;
                return BadRequest(resultModel);
            }


            throw new ApplicationException("INVALID_LOGIN_ATTEMPT");
        }



        [Authorize]
        [HttpGet]
        public async Task<object> Protected()
        {
            return "Protected area";
        }

        private async Task<object> GenerateJwtToken(string email, IdentityUser user)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.Now.AddDays(Convert.ToDouble(_configuration["JwtExpireDays"]));

            var token = new JwtSecurityToken(
                _configuration["JwtIssuer"],
                _configuration["JwtIssuer"],
                claims,
                expires: expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }
}