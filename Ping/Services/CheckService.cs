using System;
using System.Net;
using System.Net.Http;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Ping.Entities;
using HtmlAgilityPack;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;


namespace Ping.Services
{
    public class CheckService : ICheckService
    {


        private readonly PingContext _context;
        private IEmailService _emailservice;


        public CheckService(PingContext context, IEmailService emailService)
        {
            _context = context;
            _emailservice = emailService;
        }


        public async Task CheckWebsites()
        {

            var websitesi = GetWebsites();
            foreach (var website in websitesi)
            {
                var kontrolSayisi = website.KontrolSayısı;
                var result = await CheckWebsite(website);
                if (result == false)
                {
                    kontrolSayisi++;
                    website.KontrolSayısı = kontrolSayisi;
                    if (kontrolSayisi >= website.DenemeSayısı)
                    {
                        website.StatusId = 3;
                        sendEmail(website.FirmaName,website.FirmaUrl,DateTime.Now.ToString());
                        System.Diagnostics.Debug.WriteLine("Sistem hatalı");
                        var logError = new Log { StatusIdLog = website.StatusId,  DateTime = DateTime.Now, FirmaIsmi = website.FirmaName, FirmaSiteAdresi = website.FirmaUrl, Aciklama ="Ping, "+website.FirmaName + " firmasındaki, '" + website.FirmaUrl + "' adresinde hata bulup mail yollamıştır." };
                        _context.Logs.Add(logError);
                        website.KontrolSayısı = 0;
                    }
                }
                else if (result == true)
                {
                    if (website.KontrolSayısı != 0)
                    {
                        website.KontrolSayısı = 0;
                    }
                    if (website.StatusId != 2)
                    {
                        website.StatusId = 2;
                    }
                  
                }
                website.KontrolEdilenZaman = DateTime.Now;
                _context.Products.Update(website);
                var log = new Log {StatusIdLog=website.StatusId, DateTime = DateTime.Now, FirmaIsmi = website.FirmaName, FirmaSiteAdresi = website.FirmaUrl, Aciklama = "Ping, " + website.FirmaName + " firmasındaki '" + website.FirmaUrl + "' adresini kontrol etti." };
                _context.Logs.Add(log);
            }
            await _context.SaveChangesAsync();

        }

        private async Task<bool> CheckWebsite(Product websites)
        {
            try
            {
                HttpClient client = new HttpClient();
                var response = await client.GetAsync(websites.FirmaUrl);
                var pageContents = await response.Content.ReadAsStringAsync();
                if (pageContents == "Healthy")
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch
            {
                return false;
            }
        }


        private List<Product> GetWebsites()
        {
            return _context.Products.ToList().Where(x=>(DateTime.Now-x.KontrolEdilenZaman).Minutes > x.KontrolZamanı).ToList();
        }
        private async void sendEmail(string wrongCompany,string wrongCompanyAdress,string dateTime)
        {
            UserEmailOptions options = new UserEmailOptions
            {
                ToEmails = new List<string>() { "denemekullaniciad35@gmail.com" },
                PlaceHolders=new List<KeyValuePair<string, string>>()
                {
                    new KeyValuePair<string, string>("{{firma}}",wrongCompany),
                    new KeyValuePair<string, string>("{{adres}}",wrongCompanyAdress),
                    new KeyValuePair<string, string>("{{zaman}}",dateTime),
                }
            };
            await _emailservice.SendTestEmail(options);
        }
    }
}
