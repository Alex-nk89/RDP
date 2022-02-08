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
        public string TagName { get; set; } = string.Empty;

        public bool AddChangeProduct(List<QueryProduct> newValues)
        {
            try
            {
                List<QueryProduct> initialValues = new();
                QueryProduct queryProduct = new();
                Parameter parameter = new();
                ParameterTag parameterTag = new();

                bool isOperationAdding = newValues.First().ProductId == 0 ? true : false;

                Products product = new Products()
                {
                    ProductId = newValues.First().ProductId,
                    ProductName = newValues.First().ProductName
                };

                initialValues = queryProduct.GetListProducts(string.Empty, product.ProductId);
                product.ProductId = new Products().AddChangeProduct(product);

                int[] currentParametersIds = newValues.Select(lv => lv.ParameterId).Distinct().ToArray();
                int[] initialParametersIds = initialValues.Select(iv => iv.ParameterId).Distinct().ToArray();
                int[] removingParametersIds = initialParametersIds.Except(currentParametersIds).ToArray();

                // Добавление параметров
                foreach (int parameterId in currentParametersIds)
                {
                    Parameter addingParameter = newValues.Where(nw => nw.ParameterId == parameterId)
                        .Select(nw => new Parameter()
                        {
                            ParameterId = isOperationAdding ? 0 : parameterId,
                            ProductId = product.ProductId,
                            ParameterTypeId = nw.ParameterTypeId,
                            Position = nw.Position,
                            Round = nw.Round,
                            ShowLimit = nw.ShowLimits
                        }).First();

                    parameter.ParameterId = parameter.AddParameter(addingParameter);

                    int[] currentTagsIds = newValues.Where(nw => nw.ParameterId == parameterId)
                        .Select(nw => nw.TagId).Distinct().ToArray();
                    int[] initialTagsIds = initialValues.Where(nw => nw.ParameterId == parameterId)
                        .Select(nw => nw.TagId).Distinct().ToArray();
                    int[] removingTagsIds = initialTagsIds.Except(currentTagsIds).ToArray();

                    foreach (int tagId in currentTagsIds) // Добавление тегов в таблицу ParameterTag
                    {
                        var parameterTags = initialValues.Where(iv => iv.ParameterId == parameterId)
                            .Where(iv => iv.TagId == tagId).ToList();

                        ParameterTag addingParameterTag = new()
                        {
                            ParameterTagId = parameterTags.Count > 0 ? parameterTags.First().ParameterTagId : 0,
                            ParameterId = parameter.ParameterId,
                            TagId = tagId
                        };

                        parameterTag.AddParameterTag(addingParameterTag);
                    }

                    foreach (int tagId in removingTagsIds) // Удаление тегов из таблицы ParameterTag
                    {
                        int parameterTagId = initialValues.Where(iv => iv.ParameterId == parameterId)
                            .Where(iv => iv.TagId == tagId).First().ParameterTagId;

                        List<ParameterTag> removingParameterTag = new()
                            {
                                new ParameterTag()
                                {
                                    ParameterTagId = parameterTagId
                                }
                            };

                        parameterTag.RemoveParameterTag(removingParameterTag);
                    }
                }

                // Удаление параметров
                List<Parameter> removingParameters = initialValues
                    .Where(rp => removingParametersIds.Contains(rp.ParameterId))
                    .Select(rp => new Parameter()
                    {
                        ParameterId = rp.ParameterId
                    }).Distinct().ToList();

                parameter.RemoveParameter(removingParameters);

                List<ParameterTag> removingParameterTags = initialValues
                    .Where(iv => removingParametersIds.Contains(iv.ParameterId))
                    .Select(iv => new ParameterTag()
                    {
                        ParameterTagId = iv.ParameterTagId
                    }).Distinct().ToList();

                parameterTag.RemoveParameterTag(removingParameterTags);

                return true;
            }
            catch
            {
                throw new Exception();
            }
        }

        public List<QueryProduct> GetListProducts(string name, int? productId = null)
        {
            using(RDPContext rdp_base = new())
            {
                List<QueryProduct> listProducts = (from product in rdp_base.Set<Products>()
                                   join parameter in rdp_base.Set<Parameter>()
                                        on product.ProductId equals parameter.ProductId into parameters
                                   from parameter in parameters.DefaultIfEmpty()
                                   join parameterTag in rdp_base.Set<ParameterTag>()
                                        on parameter.ParameterId equals parameterTag.ParameterId into parameterTags
                                   from parameterTag in parameterTags.DefaultIfEmpty()
                                   join tag in rdp_base.Set<Tag>()
                                        on parameterTag.TagId equals tag.TagId into tags
                                   from tag in tags.DefaultIfEmpty()
                                   where productId == null ? EF.Functions.Like(product.ProductName, $"%{name}%") : product.ProductId == productId
                                   select new QueryProduct() { 
                                       ProductId = product.ProductId, 
                                       ProductName = product.ProductName, 
                                       ParameterId = parameter.ParameterId, 
                                       ParameterTypeId = parameter.ParameterTypeId,
                                       Position = parameter.Position,
                                       Round = parameter.Round,
                                       ShowLimits = parameter.ShowLimit,
                                       ParameterTagId = parameterTag.ParameterTagId,
                                       TagId = parameterTag.TagId,
                                       TagName = tag.TagName
                                   }).AsNoTracking().ToList();

                return listProducts;
            }
        }
    }
}
