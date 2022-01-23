using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Ping.Entities
{
    public class UserRepository : IUserRepository
    {
        private readonly PingContext _context;

        public UserRepository(PingContext context)
        {
            _context = context;
        }
        public User GetByEmail(string email)
        {
            return _context.Users.FirstOrDefault(u => u.Email == email);
        } 
        
        public User GetById(int id)
        {
            return _context.Users.FirstOrDefault(u => u.Id == id);
        }
    }
}
