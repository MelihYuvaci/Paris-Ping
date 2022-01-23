using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Ping.Services
{
    public interface ICheckService
    {
        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        Task CheckWebsites();
    }
}
