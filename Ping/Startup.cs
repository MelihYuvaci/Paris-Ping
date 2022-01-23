using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Ping.Entities;
using Ping.Jobs;
using Ping.Services;
using Quartz;
using Quartz.Impl;
using System;
using System.Configuration;

namespace Ping
{
    public class Startup
    {

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors();

            services.AddDbContext<PingContext>(opt =>
            {
                opt.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"));
            });
            services.AddControllersWithViews();
            services.AddSwaggerDocument(config =>
            {
                config.PostProcess = (doc =>
                {
                    doc.Info.Title = "Mazaka Ping Api";
                });

            });

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });
            services.Configure<QuartzOptions>(Configuration.GetSection("Quartz"));
            services.Configure<QuartzOptions>(options =>
            {
                options.Scheduling.IgnoreDuplicates = true; // default: false
                options.Scheduling.OverWriteExistingData = true; // default: true
            });

             
            services.AddScoped<IEmailService, EmailService>();
            services.AddScoped<ICheckService, CheckService>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<JwtService>();

            services.Configure<SMTPConfig>(Configuration.GetSection("SMTPConfig"));

            services.AddQuartz(q =>
            {
                q.UseMicrosoftDependencyInjectionJobFactory();
                q.UseSimpleTypeLoader();
                q.UseInMemoryStore();
                q.UseDefaultThreadPool(tp =>
                {
                    tp.MaxConcurrency = 10;
                });

                var jobKey = new JobKey("awesome job", "awesome group");
                q.AddJob<CheckJob>(jobKey, j => j
                    .WithDescription("my awesome job")
                );

                q.AddTrigger(t => t
                    .WithIdentity("Simple Trigger")
                    .ForJob(jobKey)
                    .StartNow()
                    .WithDescription("my awesome simple trigger")
                    .WithSimpleSchedule(x => x.WithInterval(TimeSpan.FromMinutes(5)).RepeatForever())
                );//FromMinutes,//FromSeconds

            });

            services.AddQuartzHostedService(options =>
            {
                options.WaitForJobsToComplete = true;
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();
            
            app.UseRouting();
            app.UseCors(options => options
            .WithOrigins(new[] { "https://localhost:3000", "https://localhost:8080 ", "https://localhost:4000", "https://localhost:4200", "https://localhost:5001", "https://localhost:5000" })
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
            );
            app.UseOpenApi();
            app.UseSwaggerUi3();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
           
        }
    }
}