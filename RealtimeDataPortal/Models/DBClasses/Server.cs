namespace RealtimeDataPortal.Models
{
    public class Server
    {
        public int ServerId { get; set; }
        public string ServerName { get; set; } = string.Empty;
        public string Database { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public bool IsDateOffset { get; set; } = true;

        public List<Server> GetListServers(string? name)
        {
            using (RDPContext rdp_base = new())
            {
                IQueryable<Server> listServers = rdp_base.Server;

                if (name is not null)
                    listServers = listServers
                        .Where(server => EF.Functions.Like(server.ServerName, $"%{name}%"));

                return listServers.AsNoTracking().ToList();
            }
        }

        public void EditServer(Server server)
        {
            using (RDPContext rdp_base = new())
            {
                rdp_base.Server.Update(server);
                rdp_base.SaveChanges();
            }
        }

        public void DeleteServers(int[] ids)
        {
            using (RDPContext rdp_base = new())
            {
                var deletingServes = rdp_base.Server
                    .Where(server => ids.Contains(server.ServerId))
                    .AsNoTracking();

                rdp_base.Server.RemoveRange(deletingServes);
                rdp_base.SaveChanges();
            }
        }
    }
}
