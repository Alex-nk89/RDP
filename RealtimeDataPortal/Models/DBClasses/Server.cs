using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace RealtimeDataPortal.Models
{
    public class Server
    {
        public int ServerId { get; set; }
        public string ServerName { get; set; } = string.Empty;
        public string Database { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        [NotMapped]
        public bool IsDateOffset { get; set; } = true;

        public List<Server> GetServers()
        {
            List<Server> servers = new();

            using (RDPContext rdp_base = new())
            {
                servers = rdp_base.Server.ToList();

                return servers;
            }
        }

        public List<Server> GetListServers(string name)
        {
            using RDPContext rdp_base = new();

            var listServers = rdp_base.Server
                .Where(server => EF.Functions.Like(server.ServerName, $"%{name}%"))
                .AsNoTracking()
                .ToList();

            return listServers;
            
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
            using(RDPContext rdp_base = new())
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
