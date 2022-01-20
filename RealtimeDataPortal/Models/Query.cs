namespace RealtimeDataPortal.Models
{
    public class Query
    {
        public string StartDate { get; set; } = string.Empty;
        public string EndDate { get; set; } = string.Empty;
        public string Calendar { get; set; } = string.Empty;
        public string? ServerConnection { get; set; } = string.Empty!;

        public void Deconstruct(out string startDate, out string endDate, out string calendar, out string? serverConnection)
        {
            startDate = this.StartDate;
            endDate = this.EndDate;
            calendar = this.Calendar;
            serverConnection = this.ServerConnection;
        }

        public List<History> GetGraphic(Query query, User user)
        {
            DateTime start = DateTime.Now;
            DateTime end = DateTime.Now;
            //CheckAccess.CheckAccess check = new CheckAccess.CheckAccess();

            //if (!check.GetAccess(id, user))
            //    throw new ForbiddenException("У Вас нет доступа к странице.");

            (string startDate, string endDate, string calendar, string? serverConnection) = query;

            // Для суточных добавляем день (так данные от сегодня фактически показывают данные за вчера)
            // и добавляем 3 часа чтобы быть уверенным о том, что изменения успели записаться в БД
            if (calendar == "day")
            {
                if(startDate == null || endDate == null)
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

            if(calendar ==  "range")
            {
                if (startDate == null || endDate == null)
                {
                    start.AddHours(-1);
                }
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

