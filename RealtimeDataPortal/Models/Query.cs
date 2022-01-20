using System.Data.OleDb;

namespace RealtimeDataPortal.Models
{
    public class Query
    {
        public string TagName { get; set; } = string.Empty;
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string Calendar { get; set; } = string.Empty;
        public string? ServerConnection { get; set; }
        public int? WwResolution { get; set; }

        public void Deconstruct(out DateTime? startDate, out DateTime? endDate, out string calendar, out string? serverConnection,
            out string tagName, out int? wwResolution)
        {
            tagName = this.TagName;
            startDate = this.StartDate;
            endDate = this.EndDate;
            calendar = this.Calendar;
            serverConnection = this.ServerConnection;
            wwResolution = this.WwResolution;
        }

        public List<History> GetGraphic(Query query, User user)
        {
            DateTime start = DateTime.Now;
            DateTime end = DateTime.Now;
            // Единицы измерения
            string? unit = null;
            // Шкала
            double? scaleMinEU = 0; 
            double? scaleMaxEU = 0;
            //Лимиты
            double? limitHi = null; 
            double? limitHihi = null;
            double? limitLo = null;
            double? limitLolo = null;

            //CheckAccess.CheckAccess check = new CheckAccess.CheckAccess();

            //if (!check.GetAccess(id, user))
            //    throw new ForbiddenException("У Вас нет доступа к странице.");

            (DateTime? startDate, DateTime? endDate, string calendar, string? serverConnection, string tagName, int? wwResolution) = query;

            // Для суточных добавляем день (так данные от сегодня фактически показывают данные за вчера)
            // и добавляем 3 часа чтобы быть уверенным о том, что изменения успели записаться в БД
            if (calendar == "day")
            {
                if(startDate is null || endDate is null)
                {
                    start = DateTime.Now;
                    end = start.AddDays(1);
                }

                start = start.AddHours(3);
                end = end.AddHours(3);
            }

            // Для часовых и получасовых за полный текущий день
            // Смещение на 10 минут, так как запись значений в БД происходит с опозданием
            if(calendar == "month")
            {
                if (startDate == null || endDate == null)
                {
                    start = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);
                    end = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1).AddMonths(1);
                }

                start = start.AddHours(1).AddMinutes(10);
                end = end.AddMinutes(10);
            }

            if(calendar ==  "range" && (startDate is null || endDate is null))
            {
                start.AddHours(-1);
            }

            // Получение доп.значений для тэга (шкала, лимиты)
            using(OleDbConnection connection = new OleDbConnection(serverConnection))
            {
                try
                {
                    string sqlExpression = $"select at.TagName, eu.Unit, at.MaxEU, at.MinEU, lm.Value, lmn.Name " +
                        $"from [Runtime].[dbo].[AnalogTag] as at " +
                        $"left join [Runtime].[dbo].[EngineeringUnit] as eu " +
                        $"on at.EUKey = eu.EUKey " +
                        $"left join [Runtime].[dbo].[Limit] as lm " +
                        $"on at.TagName = lm.TagName " +
                        $"left join [Runtime].[dbo].[LimitName] as lmn " +
                        $"on lm.LimitNameKey = lmn.LimitNameKey " +
                        $"where at.TagName = '{tagName}' ";

                    connection.Open();
                    OleDbCommand command = new OleDbCommand(sqlExpression, connection);
                    OleDbDataReader result = command.ExecuteReader();

                    while (result.Read())
                    {
                        unit = result["Unit"].ToString();
                        scaleMinEU = (double)result["MinEU"];
                        scaleMaxEU = (double)result["MaxEU"];

                        switch (result["Name"].ToString())
                        {
                            case "HiHi":
                                limitHihi = (double)result["Value"];
                                break;
                            case "Hi":
                                limitHi = (double)result["Value"];
                                break;
                            case "Lo":
                                limitLo = (double)result["Value"];
                                break;
                            case "LoLo":
                                limitLolo = (double)result["Value"];
                                break;
                        };
                    }
                }
                catch { }
            }

            // История данных тега
            using(OleDbConnection connection = new OleDbConnection(serverConnection))
            {
                // Если выборка за большой период,то увеличиваем wwResolution так, 
                // чтобы в результате было не более 480 значений
                if ((end.Subtract(start).TotalMilliseconds / wwResolution) > 480)
                        wwResolution = (int)Math.Round(end.Subtract(start).TotalMilliseconds / 480);
            }

            return new List<History>();
        } 
    }
}

//public string TagName { get; set; }
//public string TagType { get; set; }
//public string NameType { get; set; }
//public string ParameterName { get; set; }
//public string Position { get; set; }
//public int WwResolution { get; set; }
//public string CalendarType { get; set; }
//public bool VisibleToGraphic { get; set; }
//public bool ShowLimit { get; set; }
//public int IdServer { get; set; }
//public string Color { get; set; }
//public int Round { get; set; }
//public string NameGraphic { get; set; }

