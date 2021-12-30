using System.DirectoryServices.AccountManagement;
using RealtimeDataPortal.Models;

namespace RealtimeDataPortal.Models
{
    public class User
    {
        public string Name { get; set; } = "";
        public List<string> Groups { get; set; } = new List<string>();
        public bool FullView { get; set; } = false;
        public bool Configurator { get; set; } = false;
        public bool Administrator { get; set; } = false;

        public void GetUser()
        {
            //PrincipalContext ADContextGeneral = new PrincipalContext(ContextType.Domain);
            //UserPrincipal user = UserPrincipal.FindByIdentity(ADContextGeneral, /*HttpContext.User.Identity.Name*/ "NagaytsevAE");
            //PrincipalSearchResult<Principal> userGroups = user.GetAuthorizationGroups();

            Name = "Нагайцев Александр Евгеньевич"; //user.DisplayName;

            //if (userGroups.Count() > 0)
            //{
            //    foreach(var group in userGroups)
            //    {
            //        Groups.Add(group.Name);
            //    }
            //}          

            Access access = new Access();
            var accessList = access.GetAccess();

            if(Groups.Contains(accessList.Where(al => al.Function == "fullView").Select(al => al.ADGroup).First()))
            {
                FullView = true;
            }

            if (Groups.Contains(accessList.Where(al => al.Function == "configuratorer").Select(al => al.ADGroup).First()))
            {
                Configurator = true;
            }

            if (Groups.Contains(accessList.Where(al => al.Function == "administrator").Select(al => al.ADGroup).First()))
            {
                Administrator = true;
            }
        }
    }
}


            

            
             