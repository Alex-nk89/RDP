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

        public List<Query_rtTable> GetTableRealtime(int id, CurrentUser currentUser)
        {
            // 1. Собираем данные для построения таблицы
            // 2. Получаем текущие значения для тегов из таблицы
            // 3. Обьединяем таблицы

            CheckAccess.CheckAccess check = new CheckAccess.CheckAccess();

            if (!check.GetAccess(id, currentUser))
                throw new Exception("NotAccessForView");

            List<Query_rtTable> tableRealtime = new();

            using (RDPContext rdp_base = new())
            {
                tableRealtime = (from treesMenu in rdp_base.TreesMenu
                                 join table in rdp_base.rt_Tables
                                    on treesMenu.ComponentId equals table.TableId
                                 join section in rdp_base.rt_Sections
                                    on table.TableId equals section.TableId
                                 join sectionProduct in rdp_base.rt_SectionProduct
                                    on section.SectionId equals sectionProduct.SectionId
                                 join product in rdp_base.Products
                                    on sectionProduct.ProductId equals product.ProductId
                                 join parameter in rdp_base.Parameter
                                    on product.ProductId equals parameter.ProductId
                                 join parameterTag in rdp_base.ParameterTag
                                    on parameter.ParameterId equals parameterTag.ParameterId
                                 join tag in rdp_base.Tag
                                    on parameterTag.TagId equals tag.TagId
                                 join tagsType in rdp_base.TagsType
                                    on tag.TagTypeId equals tagsType.TagTypeId
                                 join parameterType in rdp_base.ParameterType
                                    on parameter.ParameterTypeId equals parameterType.ParameterTypeId
                                 join server in rdp_base.Server
                                    on tag.ServerId equals server.ServerId
                                 where treesMenu.Id == id
                                 select new Query_rtTable()
                                 {
                                     Id = treesMenu.Id,
                                     Name = treesMenu.Name,
                                     PositionVisible = table.PositionVisible,
                                     UnitVisible = table.UnitVisible,
                                     ScaleVisible = table.ScaleVisible,
                                     LimitVisible = table.LimitVisible,
                                     SectionName = section.SectionName,
                                     ProductId = product.ProductId,
                                     ProductName = product.ProductName,
                                     NameParameter = parameterType.ParameterTypeName,
                                     ProductsParameterId = parameter.ParameterId,
                                     Position = parameter.Position,
                                     Round = parameter.Round,
                                     TagName = tag.TagName,
                                     TagTypeId = tagsType.TagTypeId,
                                     TypeShortName = tagsType.TypeShortName,
                                     ServerName = server.ServerName,
                                     ServerConnection = $"Provider=SQLOLEDB;Server={server.ServerName};Database={server.Database};" +
                                            $"User Id={server.UserName};Password={server.Password}"
                                 }).ToList();

                if (tableRealtime.Count == 0) throw new Exception("NotFound");
            }

            List<string> serverList = (from server in tableRealtime
                                       select server.ServerName).Distinct().ToList();

            // Получение значений для тегов
            List<QueryInServer_rtTable> listValues = new List<QueryInServer_rtTable>();

            Parallel.ForEach(serverList, (string server) =>
            {
                List<Query_rtTable> valueOneServer = tableRealtime.Where(tr => tr.ServerName == server).ToList();

                // Список тегов
                string tagNames = string.Empty;

                foreach (var value in valueOneServer)
                {
                    tagNames += $"'{value.TagName}',";
                }

                tagNames = tagNames.Remove(tagNames.Length - 1);

                listValues.AddRange(GetValueForTags(tagNames, valueOneServer.First().ServerConnection, tableRealtime.First().LimitVisible));
            });

            tableRealtime = (from table in tableRealtime
                             join values in listValues
                                on table.TagName equals values.TagName into listValue
                             from value in listValue.DefaultIfEmpty()
                             orderby table.ProductName, table.TagTypeId
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
                                 Value = value?.Value ?? null,
                                 Unit = value?.Unit ?? null,
                                 Scale = value?.Scale ?? null,
                                 Limits = value?.Limits ?? null,
                                 TypeShortName = table.TypeShortName,
                                 ServerName = table.ServerName,
                             })
                             .ToList();

            return tableRealtime;
        }

        public List<QueryInServer_rtTable> GetValueForTags(string tagNames, string stringConnectionServer, bool isLimitVisible)
        {
            List<QueryInServer_rtTable> listValues = new List<QueryInServer_rtTable>();

            using (OleDbConnection connection = new OleDbConnection(stringConnectionServer))
            {
                string selectLimit = isLimitVisible ?
                    ",\n [Runtime].[dbo].[Limit].LimitNameKey, [Runtime].[dbo].[Limit].Value as LimitValue " : " ";

                string joinLimit = isLimitVisible ? "\n left join [Runtime].[dbo].[Limit] " +
                    "\n on [Runtime].[dbo].[Live].TagName = [Runtime].[dbo].[Limit].TagName " : "";

                string sqlExpression = $"select [Runtime].[dbo].[Live].TagName, [Runtime].[dbo].[Live].Value, " +
                            $"[Runtime].[dbo].[AnalogTag].MinEU, [Runtime].[dbo].[AnalogTag].MaxEU, " +
                            $"[Runtime].[dbo].[EngineeringUnit].Unit{selectLimit}" +
                            $"from [Runtime].[dbo].[Live] " +
                            $"join [Runtime].[dbo].[AnalogTag] " +
                            $"on [Runtime].[dbo].[Live].TagName = [Runtime].[dbo].[AnalogTag].TagName " +
                            $"join [Runtime].[dbo].[EngineeringUnit] " +
                            $"on [Runtime].[dbo].[AnalogTag].EUKey = [Runtime].[dbo].[EngineeringUnit].EUKey {joinLimit}" +
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
                        Scale = $"{(double)result["MinEU"]}...{(double)result["MaxEU"]}",
                        LimitType = isLimitVisible ? result["LimitNameKey"].ToString() : null,
                        LimitValue = isLimitVisible ? result["LimitValue"].ToString() : null
                    });
                }
            }

            if (!isLimitVisible)
                return listValues;

            var listValueWithLimits = listValues.GroupBy(value => value.TagName);
            listValues = new List<QueryInServer_rtTable>();

            foreach (var value in listValueWithLimits)
            {
                string limits = string.Empty;
                string? Lolo = value.Where(value => value.LimitType == "1").Select(value => value.LimitValue).FirstOrDefault();
                string? Lo = value.Where(value => value.LimitType == "2").Select(value => value.LimitValue).FirstOrDefault();
                string? Hi = value.Where(value => value.LimitType == "3").Select(value => value.LimitValue).FirstOrDefault();
                string? Hihi = value.Where(value => value.LimitType == "4").Select(value => value.LimitValue).FirstOrDefault();

                if ((Lolo is not null || Hihi is not null) && (Lo is not null || Hi is not null))
                {
                    limits = $"{Lolo}, {Lo} ... {Hi}, {Hihi}";
                }
                else if (Lolo is not null || Hihi is not null)
                {
                    limits = $"{Lolo} ... {Hihi}";
                }
                else if (Lo is not null || Hi is not null)
                {
                    limits = $"{Lo} ... {Hi}";
                }

                listValues.Add(new QueryInServer_rtTable()
                {
                    TagName = value.First().TagName,
                    Unit = value.First().Unit,
                    Value = value.First().Value,
                    Scale = value.First().Scale,
                    Limits = limits
                });
            }

            return listValues;
        }

        public int AddChangeRTTable(rt_Tables rt_Tables)
        {
            using (RDPContext rdp_base = new())
            {
                rdp_base.rt_Tables.Update(rt_Tables);
                rdp_base.SaveChanges();

                return rt_Tables.TableId;
            }
        }

        public rt_Tables GetTableInfo(int componentId)
        {
            using RDPContext rdp_base = new();

            rt_Tables tableInfo =
                (from table in rdp_base.rt_Tables
                 where table.TableId == componentId
                 select table)
                 .First();

            return tableInfo;
        }
    }
}