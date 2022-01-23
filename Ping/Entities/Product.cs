using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Ping.Entities
{
    public class Product
    {
        public int Id { get; set; }
        public int StatusId { get; set; }
        public string FirmaName { get; set; }
        public string FirmaUrl { get; set; }
        public int KontrolZamanı { get; set; }
        public int DenemeSayısı { get; set; }
        public int KontrolSayısı { get; set; }
        public DateTime KontrolEdilenZaman { get; set; }

    }
}
