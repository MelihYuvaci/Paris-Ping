using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Ping.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Ping.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class LogsController : ControllerBase
    {
        private readonly PingContext _context;
        public LogsController(PingContext context)
        {
            _context = context;
        }


        /// <summary>
        /// Get All Logs4
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public IActionResult GetProducts([FromQuery] Filter filter)
        {
            IQueryable<Log> list = _context.Logs;
           
            if (!string.IsNullOrEmpty(filter.DateTimeStart)&& !string.IsNullOrEmpty(filter.DateTimeEnd))
            {
                list = list.Where(x => (x.DateTime >= Convert.ToDateTime(filter.DateTimeStart) && x.DateTime <= Convert.ToDateTime(filter.DateTimeEnd)));
            }
            if (filter.StatusId == 2 || filter.StatusId == 3)
            {
                list = list.Where(x => x.StatusIdLog == filter.StatusId);
            }
            if (!string.IsNullOrEmpty(filter.CompanyName))
            {
                list = list.Where(x => x.FirmaIsmi.Contains(filter.CompanyName));
            }
            if (!string.IsNullOrEmpty(filter.CompanyAdress))
            {
                list = list.Where(x => x.FirmaSiteAdresi.Contains(filter.CompanyAdress));
            }
            var total = list.Count();
            list = list.Skip((filter.PageIndex - 1) * filter.PageSize).Take(filter.PageSize);
            return Ok(new
            {
                Data = list.ToList(),
                PageSize = filter.PageSize,
                PageIndex = filter.PageIndex,
                Total = total
            });

        }
        public class Filter
        {
            public string DateTimeStart { get; set; }
            public string DateTimeEnd{ get; set; }
            public int? StatusId { get; set; }
            public string CompanyName { get; set; }
            public string CompanyAdress { get; set; }
            public int PageIndex { get; set; } = 1;
            public int PageSize { get; set; } = 10;
        }
    }
}