using Microsoft.Extensions.Options;
using Ping.Entities;
using Ping.Services;
using Quartz;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace Ping.Jobs
{
    public class CheckJob : IJob
    {

        private ICheckService _checkService;

        public CheckJob(ICheckService checkService)
        {
            _checkService = checkService;
        }
        public async Task Execute(IJobExecutionContext context)
        {

            System.Diagnostics.Debug.WriteLine("Greetings from HelloJob!");
            await _checkService.CheckWebsites();
        }
    }
}