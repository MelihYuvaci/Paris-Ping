using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Ping.Entities
{
    public class PingContext :DbContext
    {
        
        public PingContext(DbContextOptions<PingContext> options) : base(options)
        {

        } 
        public DbSet<Product>Products { get; set; }
        public DbSet<Log> Logs { get; set; }
        public DbSet<User>Users { get; set; } 
        
    }
}
