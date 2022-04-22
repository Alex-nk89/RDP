using RealtimeDataPortal.Models.Exceptions;
using System.Data.OleDb;

namespace RealtimeDataPortal.Models.DBClasses
{
    public class Mnemoscheme
    {
        public int MnemoschemeId { get; set; }
        public string MnemoschemeContain { get; set; } = string.Empty;

        public int EditMnemoscheme(Mnemoscheme mnemoscheme)
        {
            using (RDPContext rdp_base = new())
            {
                rdp_base.Mnemoscheme.Update(mnemoscheme);
                rdp_base.SaveChanges();

                return mnemoscheme.MnemoschemeId;
            }
        }

        public Object GetMnemoschemeImage(int id, User user)
        {
            CheckAccess.CheckAccess check = new CheckAccess.CheckAccess();

            if (!check.GetAccess(id, user))
                throw new ForbiddenException("У Вас нет доступа к странице.");

            using (RDPContext rdp_base = new())
            {
                var mnemoscheme =
                    (from treesMenu in rdp_base.TreesMenu
                     join mnemoschemeData in rdp_base.Mnemoscheme
                          on treesMenu.ComponentId equals mnemoschemeData.MnemoschemeId into mnemoshemaDatas
                     from mnemoschemeData in mnemoshemaDatas.DefaultIfEmpty()
                     where treesMenu.Id == id
                     select new
                     {
                         MnemoschemeId = mnemoschemeData.MnemoschemeId,
                         MnemoschemeContain = mnemoschemeData.MnemoschemeContain,
                         MnemoschemeName = treesMenu.Name
                     })
                     .AsNoTracking()
                     .ToList();

                if (mnemoscheme.Count == 0) throw new NotFoundException("Страница не найдена.");

                return mnemoscheme;
            }
        }

        class TagData
        {
            public int TagId { get; set; }
            public string? TagName { get; set; }
            public int ServerId { get; set; }
            public string ConnectionString { get; set; } = string.Empty;
            public double? Value { get; set; }
        }

        public Object GetMnemoschemeTagsValues(int[] tagsId)
        {
            List<TagData> listTags = new();
            List<TagData> listTagsWithValues = new();
            List<int> serversId = new();

            using (RDPContext rdp_base = new())
            {
                listTags =
                    (from tag in rdp_base.Tag
                     join server in rdp_base.Server
                        on tag.ServerId equals server.ServerId into servers
                     from server in servers.DefaultIfEmpty()
                     where tagsId.Contains(tag.TagId)
                     select new TagData()
                     {
                         TagId = tag.TagId,
                         TagName = tag.TagName,
                         ServerId = server.ServerId,
                         ConnectionString = $"Provider=SQLOLEDB;Server={server.ServerName};Database={server.Database};" +
                                $"User Id={server.UserName};Password={server.Password}"
                     })
                     .ToList();
            }

            serversId = listTags.Select(serverId => serverId.ServerId).Distinct().ToList();

            foreach (var serverId in serversId)
            {
                List<TagData> listTagsCurrentServer = listTags.Where(l => l.ServerId == serverId).ToList();
                List<string> listTagName = listTagsCurrentServer.Select(l => l.TagName ?? "").ToList();
                string gettingTags = string.Empty;

                foreach (var tagName in listTagName)
                {
                    gettingTags += $"'{tagName}',";
                }

                gettingTags = gettingTags.Remove(gettingTags.Length - 1);

                using (OleDbConnection connection = new OleDbConnection(listTagsCurrentServer.First().ConnectionString))
                {
                    string sqlExpression =
                        $"select [Runtime].[dbo].[Live].TagName, [Runtime].[dbo].[Live].Value " +
                        $"from [Runtime].[dbo].[Live] " +
                        $"where [Runtime].[dbo].[Live].TagName in ({gettingTags})";

                    connection.Open();
                    OleDbCommand command = new OleDbCommand(sqlExpression, connection);
                    OleDbDataReader result = command.ExecuteReader();

                    List<TagData> tagsValue = new List<TagData>();

                    while (result.Read())
                    {
                        tagsValue.Add(new TagData()
                        {
                            TagName = result["TagName"].ToString(),
                            Value = (double?)result["Value"]
                        });
                    }

                    listTagsCurrentServer =
                        (from list in listTagsCurrentServer
                         join tag in tagsValue
                            on list.TagName equals tag.TagName into tags
                         from tag in tags.DefaultIfEmpty()
                         select new TagData()
                         {
                             TagId = list.TagId,
                             TagName = list.TagName,
                             Value = tag.Value,
                             ServerId = 0,
                             ConnectionString = string.Empty
                         })
                         .ToList();

                    listTagsWithValues = listTagsWithValues.Union(listTagsCurrentServer).ToList();
                }
            }

            return listTagsWithValues;
        }
    }
}
