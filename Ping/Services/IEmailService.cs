using Ping.Entities;
using System.Threading.Tasks;

namespace Ping.Services
{
    public interface IEmailService
    {
        Task SendTestEmail(UserEmailOptions userEmailOptions);
    }
}