using System.DirectoryServices.AccountManagement;
using RealtimeDataPortal.Models;

namespace RealtimeDataPortal.Models
{
    public class User
    {
        public string Name { get; set; } = "";
        public List<string> Groups { get; set; } = new List<string>();// { "GTU75view", "testView", "configurator" };
        public bool isFullView { get; set; } = false;
        public bool isConfigurator { get; set; } = false;
        public bool isAdministrator { get; set; } = false;

        public User()
        {
            GetUser();
        }

        public void GetUser()
        {
            PrincipalContext ADContextGeneral = new PrincipalContext(ContextType.Domain);
            UserPrincipal user = UserPrincipal.FindByIdentity(ADContextGeneral, /*HttpContext.User.Identity.Name*/ "NagaytsevAE");
            PrincipalSearchResult<Principal> userGroups = user.GetAuthorizationGroups();

            Name = user.DisplayName; // "Нагайцев Александр Евгеньевич";

            if (userGroups.Count() > 0)
            {
                foreach(var group in userGroups)
                {
                    Groups.Add(group.Name);
                }
            }          

            Access access = new Access();
            var accessList = access.GetAccess();

            if (Groups.Contains(accessList.Where(al => al.Function == "fullView").Select(al => al.ADGroup).First()))
            {
                isFullView = true;
            }

            if (Groups.Contains(accessList.Where(al => al.Function == "customizer").Select(al => al.ADGroup).First()))
            {
                isConfigurator = true;
            }

            if (Groups.Contains(accessList.Where(al => al.Function == "admin").Select(al => al.ADGroup).First()))
            {
                isAdministrator = true;
            }
        }
    }
}


            

            
             