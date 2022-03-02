namespace RealtimeDataPortal.Exceptions
{
    public class ListMessagesError
    {
        public string GetList { get; } = "При попытке получить данные с сервера произошла ошибка.";
        public string NotAccess { get; } = "У Вас нет доступа к данной операции.";
        public string NotSaved { get; } = "При сохранении данных произошла ошибка.";
        public string Saved { get; } = "Данные сохранены.";
        public string Deleted { get; } = "Данные сохранены.";
        public string NotDeleted { get; } = "Данные сохранены.";
    }
}
