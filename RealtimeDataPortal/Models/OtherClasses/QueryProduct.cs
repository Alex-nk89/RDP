using Microsoft.EntityFrameworkCore;

namespace RealtimeDataPortal.Models.OtherClasses
{
    public class QueryProduct
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int ParameterId { get; set; }
        public int ParameterTypeId { get; set; }
        public string Position { get; set; } = string.Empty;
        public int Round { get; set; }
        public bool ShowLimits { get; set; } = false;
        public int ParameterTagId { get; set; }
        public int TagId { get; set; }
        //public string TagName { get; set; } = string.Empty;

        public bool AddChangeProduct(List<QueryProduct> queryproduct)
        {
            try
            {
                Products product = new Products()
                {
                    ProductId = queryproduct.First().ProductId,
                    ProductName = queryproduct.First().ProductName
                };

                int productId = new Products().AddChangeProduct(product);

                //int[] parameter

                return true;
            }
            catch
            {
                throw new Exception();
            }
        }

        public Object GetListProducts(string name)
        {
            using(RDPContext rdp_base = new())
            {
                var listProducts = (from product in rdp_base.Set<Products>()
                                   join parameter in rdp_base.Set<Parameter>()
                                        on product.ProductId equals parameter.ProductId into parameters
                                   from parameter in parameters.DefaultIfEmpty()
                                   join parameterTag in rdp_base.Set<ParameterTag>()
                                        on parameter.ParameterId equals parameterTag.ParameterId into parameterTags
                                   from parameterTag in parameterTags.DefaultIfEmpty()
                                   join tag in rdp_base.Set<Tag>()
                                        on parameterTag.TagId equals tag.TagId into tags
                                   from tag in tags.DefaultIfEmpty()
                                   where EF.Functions.Like(product.ProductName, $"%{name}%")
                                   select new { 
                                       product.ProductId, 
                                       product.ProductName, 
                                       parameter.ParameterId, 
                                       parameter.ParameterTypeId,
                                       parameter.Position,
                                       parameter.Round,
                                       parameter.ShowLimit,
                                       parameterTag.ParameterTagId,
                                       parameterTag.TagId,
                                       tag.TagName
                                   }).AsNoTracking().ToList();

                return listProducts;
            }
        }
    }
}
