using System.Data.OleDb;

namespace RealtimeDataPortal.Models
{
    public class Query
    {
        public string TagName { get; set; } = string.Empty;
        public string? StartDate { get; set; }
        public string? EndDate { get; set; }
        public string Calendar { get; set; } = string.Empty;
        public string? ServerConnection { get; set; }
        public int? WwResolution { get; set; }
        public int Round { get; set; }

        public void Deconstruct(out string? startDate, out string? endDate, out string calendar, 
            out string? serverConnection, out string tagName, out int? wwResolution, out int round)
        {
            tagName = this.TagName;
            startDate = this.StartDate;
            endDate = this.EndDate;
            calendar = this.Calendar;
            serverConnection = this.ServerConnection;
            wwResolution = this.WwResolution;
            round = this.Round;
        }

        public Object GetGraphic(Query query, User user)
        {
            (string? startDate, string? endDate, string calendar, string? serverConnection, string tagName, int? wwResolution,
                int round) = query;

            List<History> history = new List<History>();

            DateTime start = startDate is not null ? DateTime.Parse(startDate) : DateTime.Now;
            DateTime end = endDate is not null ? DateTime.Parse(endDate) : DateTime.Now;
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

            // Для часовых и получасовых за полный текущий день
            // Смещение на 10 минут, так как запись значений в БД происходит с опозданием
            if (calendar == "day")
            {
                if(startDate is null || endDate is null)
                {
                    start = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day);
                    end = start.AddDays(1);
                }

                start = start.AddHours(1).AddMinutes(10);
                end = end.AddMinutes(10);
            }
            
            // Для суточных добавляем день (так данные от сегодня фактически показывают данные за вчера)
            // и добавляем 3 часа чтобы быть уверенным о том, что изменения успели записаться в БД
            if (calendar == "month")
            {
                if (startDate == null || endDate == null)
                {
                    start = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);
                    end = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1).AddMonths(1);
                }

                start = start.AddHours(3);
                end = end.AddHours(3);
            }

            if(calendar ==  "range" && (startDate is null || endDate is null))
            {
                end = DateTime.Now;
                start = end.AddHours(-1);
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

                // Дата в запросе форматируется под старые сервера
                string sqlExpression = $"select v_History.DateTime, v_History.Value " +
                        $"from [Runtime].[dbo].[v_History] " +
                        $"where v_History.TagName = '{tagName}' " +
                        $"and v_History.DateTime >= '{start.ToString("yyyy-MM-dd HH:mm")}' " + 
                        $"and v_History.DateTime <= '{end.ToString("yyyy-MM-dd HH:mm")}' " +
                        $"and v_History.wwRetrievalMode = 'cyclic' " +
                        $"and v_History.wwResolution = '{wwResolution}'";

                connection.Open();
                OleDbCommand command = new OleDbCommand(sqlExpression, connection);
                OleDbDataReader result = command.ExecuteReader();

                while (result.Read())
                {
                    history.Add(new History()
                    {
                        DateTime = DateTime.Parse(result["Datetime"].ToString()),
                        Value = result["value"] == DBNull.Value ? null : Math.Round((double)result["Value"], round)
                    });
                }
            }

            return new { History = history, Parameters = new { unit, scaleMaxEU, scaleMinEU, limitHi, limitHihi, limitLo, limitLolo } };
        } 
    }
}

