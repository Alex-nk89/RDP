using System.DirectoryServices.AccountManagement;

namespace RealtimeDataPortal.Models
{
    public class User
    {
        public string? Name { get; set; } = null;
        public string[] Groups { get; set; } = new string[0];
        public bool FullView { get; set; } = false;
        public bool Configurator { get; set; } = false;
        public bool Administrator { get; set; } = false;

        public void GetUser()
        {
            PrincipalContext principalContext = new PrincipalContext(ContextType.Machine); //изменить Machine на Domain

            Name = principalContext.Name;
        }
    }
}
