using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Ping.Entities
{
    public class Log
    {
        public int Id { get; set; }
        public int StatusIdLog { get; set; }
        public DateTime DateTime { get; set; }
        public string FirmaIsmi { get; set; }
        public string FirmaSiteAdresi { get; set; }
        public string Aciklama { get; set; }

    }
}
