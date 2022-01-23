using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Ping.Entities
{
    public interface IUserRepository
    {
        User GetByEmail(string email);
        User GetById(int id);

    }
}
