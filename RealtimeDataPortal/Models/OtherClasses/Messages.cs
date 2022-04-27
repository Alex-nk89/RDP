namespace RealtimeDataPortal.Exceptions
{
    public class Messages
    {
        public string Type { get; set; } = "MainError";
        public int StatusCode { get; set; } = 500;
        public string Message { get; set; } = "Внутренняя ошибка сервера";

        public Messages GetMessage (string typeError)
        {
            List<Messages> listErrors = new List<Messages>()
            {
                new Messages() { Type = "NoGetUser", StatusCode = 401, Message = "Не удалось получить данные о пользователе."  },
                new Messages() { Type = "PageNotFound", StatusCode = 404, Message = "Страница не найдена."  },
                new Messages() { Type = "NotAccess", StatusCode = 403, Message = "У Вас нет доступа к данной операции."  },
                new Messages() { Type = "NotAccessForView", StatusCode = 403, Message = "У Вас нет доступа к странице."  },
                new Messages() { Type = "Saved", StatusCode = 200, Message = "Данные сохранены."  },
                new Messages() { Type = "NotSaved", StatusCode = 500, Message = "При сохранении данных произошла ошибка."  },
                new Messages() { Type = "Deleted", StatusCode = 200, Message = "Данные удалены."  },
                new Messages() { Type = "NotDeleted", StatusCode = 500, Message = "При удалении данных произошла ошибка."  },
                new Messages() { Type = "NotDeletedNoEmptyFolder", StatusCode = 405, Message = "Невозможно удалить непустую папку!"  },
                new Messages() { Type = "NotGetData", StatusCode = 500, Message = "При попытке получить данные с сервера произошла ошибка."  }
            };

            return listErrors.FirstOrDefault(e => e.Type == typeError) ?? new Messages();
        }

        //public Dictionary<string, string> Messages { get; set; } = new Dictionary<string, string>()
        //{
        //    { "NoGetUser", "Не удалось получить данные о пользователе." },
        //};
    }
}
