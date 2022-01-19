namespace RealtimeDataPortal.Models
{
    public class Server
    {
        public int ServerId { get; set; }
        public string ServerName { get; set; } = string.Empty;
        public string Database { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;

    }
}
