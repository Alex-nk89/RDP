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

        public bool AddChangeProduct(List<QueryProduct> queryproduct)
        {
            try
            {
                Products product = new Products()
                {
                    ProductId = queryproduct.First().ProductId,
                    ProductName = queryproduct.First().ProductName
                };
                new Products().AddChangeProduct(product);

                return true;
            }
            catch
            {
                throw new Exception();
            }
        }
    }
}
