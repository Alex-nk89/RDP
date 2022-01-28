using RealtimeDataPortal.Models.Exceptions;
using RealtimeDataPortal.Models.OtherClasses;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.OleDb;

namespace RealtimeDataPortal.Models
{
    public class rt_Tables
    {
        public int TableId { get; set; }
        public bool PositionVisible { get; set; }
        public bool ScaleVisible { get; set; }
        public bool UnitVisible { get; set; }
        public bool LimitVisible { get; set; }

        public List<Query_rtTable> GetTableRealtime(int id, User user)
        {
            // 1. Собираем данные для построения таблицы
            // 2. Получаем текущие значения для тегов из таблицы
            // 3. Обьединяем таблицы

            CheckAccess.CheckAccess check = new CheckAccess.CheckAccess();

            if (!check.GetAccess(id, user))
                throw new ForbiddenException("У Вас нет доступа к странице.");

            List<Query_rtTable> tableRealtime = new List<Query_rtTable>();

            using (RDPContext rdp_base = new())
            {
                tableRealtime = (from tm in rdp_base.TreesMenu
                                 join trt in rdp_base.rt_Tables on tm.ComponentId equals trt.TableId into tables
                                 from table in tables.DefaultIfEmpty()
                                 join strt in rdp_base.rt_Sections on table.TableId equals strt.TableId into sections
                                 from section in sections.DefaultIfEmpty()
                                 join sp in rdp_base.rt_SectionProduct on section.SectionId equals sp.SectionId into sectionProducts
                                 from sectionProduct in sectionProducts.DefaultIfEmpty()
                                 join prdt in rdp_base.Products on sectionProduct.ProductId equals prdt.ProductId into products
                                 from product in products.DefaultIfEmpty()
                                 join prprm in rdp_base.ProductsParameters on product.ProductId equals prprm.ProductId into productPrm
                                 from productParameter in productPrm.DefaultIfEmpty()
                                 join ppg in rdp_base.ProductParameterGroups on productParameter.ProductsParametersId equals ppg.ProductParameterId into parameterGroups
                                 from parameterGroup in parameterGroups.DefaultIfEmpty()
                                 join tgs in rdp_base.Tags on parameterGroup.TagId equals tgs.TagId into tags
                                 from tag in tags.DefaultIfEmpty()
                                 join tt in rdp_base.TagsType on tag.TagTypeId equals tt.TagTypeId into tagsType
                                 from tagType in tagsType.DefaultIfEmpty()
                                 join tp in rdp_base.TagsParameter on tag.TagParameterId equals tp.TagParameterId into tagsParameters
                                 from tagParameter in tagsParameters.DefaultIfEmpty()
                                 join srvr in rdp_base.Server on tag.ServerId equals srvr.ServerId into servers
                                 from server in servers.DefaultIfEmpty()
                                 where tm.Id == id
                                 select new Query_rtTable()
                                 {
                                     Id = tm.Id,
                                     Name = tm.Name,
                                     PositionVisible = table.PositionVisible,
                                     UnitVisible = table.UnitVisible,
                                     ScaleVisible = table.ScaleVisible,
                                     LimitVisible = table.LimitVisible,
                                     SectionName = section.SectionName,
                                     ProductId = product.ProductId,
                                     ProductName = product.ProductName,
                                     NameParameter = productParameter.NameParameter,
                                     ProductsParameterId = productParameter.ProductsParametersId,
                                     Position = productParameter.Position,
                                     Round = productParameter.Round,
                                     TagName = tag.TagName,
                                     Value = null,
                                     Unit = null,
                                     Scale = null,
                                     Limits = null,
                                     TypeShortName = tagType.TypeShortName,
                                     ServerName = server.ServerName,
                                     ServerConnection = $"Provider=SQLOLEDB;Server={server.ServerName};Database={server.Database};" +
                                            $"User Id={server.UserName};Password={server.Password}"
                                 }).ToList();
            }

            List<string> serverList = (from server in tableRealtime
                                    select server.ServerName).Distinct().ToList();

            // Получение значений для тегов
            List<QueryInServer_rtTable> listValues = new List<QueryInServer_rtTable>();

            Parallel.ForEach(serverList, (string server) => {
                List<Query_rtTable> valueOneServer = tableRealtime.Where(tr => tr.ServerName == server).ToList();

                // Список тегов
                string tagNames = string.Empty;

                foreach(var value in valueOneServer)
                {
                    tagNames += $"'{value.TagName}',";
                }

                tagNames = tagNames.Remove(tagNames.Length - 1);

                listValues.AddRange(GetValueForTags(tagNames, valueOneServer.First().ServerConnection));
            });

            tableRealtime = (from table in tableRealtime
                             join values in listValues on table.TagName equals values.TagName into listValue
                             from value in listValue.DefaultIfEmpty()
                             select new Query_rtTable()
                             {
                                 Id = table.Id,
                                 Name = table.Name,
                                 PositionVisible = table.PositionVisible,
                                 UnitVisible = table.UnitVisible,
                                 ScaleVisible = table.ScaleVisible,
                                 LimitVisible = table.LimitVisible,
                                 SectionName = table.SectionName,
                                 ProductId = table.ProductId,
                                 ProductName = table.ProductName,
                                 NameParameter = table.NameParameter,
                                 ProductsParameterId = table.ProductsParameterId,
                                 Position = table.Position,
                                 Round = table.Round,
                                 TagName = table.TagName,
                                 Value = value.Value,
                                 Unit = value.Unit,
                                 Scale = value.Scale,
                                 Limits = value.Limits,
                                 TypeShortName = table.TypeShortName,
                                 ServerName = table.ServerName,
                             }).ToList();

            return tableRealtime;
        }

        public List<QueryInServer_rtTable> GetValueForTags(string tagNames, string stringConnectionServer)
        {
            List<QueryInServer_rtTable> listValues = new List<QueryInServer_rtTable>();

            using (OleDbConnection connection = new OleDbConnection(stringConnectionServer))
            {
                string sqlExpression = $"select [Runtime].[dbo].[Live].TagName, [Runtime].[dbo].[Live].Value, " +
                            $"[Runtime].[dbo].[AnalogTag].MinEU, [Runtime].[dbo].[AnalogTag].MaxEU, " +
                            $"[Runtime].[dbo].[EngineeringUnit].Unit " +
                            $"from [Runtime].[dbo].[Live] " +
                            $"join [Runtime].[dbo].[AnalogTag] " +
                            $"on [Runtime].[dbo].[Live].TagName = [Runtime].[dbo].[AnalogTag].TagName " +
                            $"join [Runtime].[dbo].[EngineeringUnit] " +
                            $"on [Runtime].[dbo].[AnalogTag].EUKey = [Runtime].[dbo].[EngineeringUnit].EUKey " +
                            $" where [Runtime].[dbo].[Live].TagName in ({tagNames})";

                connection.Open();
                OleDbCommand command = new OleDbCommand(sqlExpression, connection);
                OleDbDataReader result = command.ExecuteReader();

                while (result.Read())
                {
                    listValues.Add(new QueryInServer_rtTable()
                    {
                        TagName = result["TagName"].ToString(),
                        Unit = result["Unit"].ToString(),
                        Value = (double?)result["Value"],
                        Scale = $"{(double)result["MinEU"]}...{(double)result["MaxEU"]}"
                    });
                }
            }

            return listValues;
        }
    }
}
