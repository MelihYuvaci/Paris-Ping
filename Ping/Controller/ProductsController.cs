using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Ping.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Ping.Controller
{

    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly PingContext _context;
        public ProductsController(PingContext context)
        {
            _context = context;
        }
        public class FilterProduct
        {
           
            public string CompanyName { get; set; }
            public string CompanyAdress { get; set; }
            public int? StatusId { get; set; }
            public int PageIndex { get; set; } = 1;
            public int PageSize { get; set; } = 10;
        }
        /// <summary>
        /// Get All Products
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public IActionResult GetProducts([FromQuery] FilterProduct filter)
        {
            IQueryable<Product> list = _context.Products;
            
            if (filter.StatusId == 2 || filter.StatusId == 3)
            {
                list = list.Where(x => x.StatusId == filter.StatusId);
            }
            if (!string.IsNullOrEmpty(filter.CompanyName))
            {
                list = list.Where(x => x.FirmaName.Contains(filter.CompanyName));
            }
            if (!string.IsNullOrEmpty(filter.CompanyAdress))
            {
                list = list.Where(x => x.FirmaUrl.Contains(filter.CompanyAdress));
            }
            var total = list.Count();
            list = list.Skip((filter.PageIndex - 1) * filter.PageSize).Take(filter.PageSize);
            return Ok(new
            {
                Data = list.ToList(),
                PageSize = filter.PageSize,
                PageIndex = filter.PageIndex,
                Total = total
            });

        }
        /// <summary>
        /// Get Products By Id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id}")]
        public IActionResult GetProductById(int id)
        {
            return Ok(_context.Products.FirstOrDefault(I=>I.Id==id));
        } 

        /// <summary>
        /// Update the Products
        /// </summary>
        /// <param name="id"></param>
        /// <param name="product"></param>
        /// <returns></returns>
        [HttpPut("{id}")]
        public IActionResult UpdateProduct (int id,Product product)
        {
            var updatedProduct=_context.Products.FirstOrDefault(I => I.Id == id);
            updatedProduct.FirmaName = product.FirmaName;
            updatedProduct.FirmaUrl = product.FirmaUrl;
            updatedProduct.KontrolZamanı = product.KontrolZamanı;
            updatedProduct.DenemeSayısı = product.DenemeSayısı;
            updatedProduct.StatusId = product.StatusId;
            _context.SaveChanges();
            return NoContent();
        }
        /// <summary>
        /// Delete the Products
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete ("{id}")]
        public IActionResult DeleteProduct(int id)
        {
            var deleteProduct = _context.Products.FirstOrDefault(I => I.Id == id);
            _context.Remove(deleteProduct);
            _context.SaveChanges();
            return NoContent(); 
        }
        /// <summary>
        /// Create an Product
        /// </summary>
        /// <param name="product"></param>
        /// <returns></returns>
        [HttpPost]
        public IActionResult AddProduct(Product product)
        {
            product.KontrolEdilenZaman = DateTime.Now;
            _context.Add(product);
            _context.SaveChanges();
            return Created("",product);
        }
    }
}
