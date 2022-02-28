using System.DirectoryServices.AccountManagement;
using RealtimeDataPortal.Models;

namespace RealtimeDataPortal.Models
{
    public class User
    {
        public string Name { get; set; } = "";
        public List<string> Groups { get; set; } = new List<string>() { "GTU75view", "testView", "configurator", "administrator" };
        public bool IsFullView { get; set; } = false;
        public bool IsConfigurator { get; set; } = false;
        public bool IsAdministrator { get; set; } = false;

        public User(string userName)
        {
            GetUser(userName);
        }

        public void GetUser(string userName)
        {
            //PrincipalContext ADContextGeneral = new PrincipalContext(ContextType.Domain);
            //UserPrincipal user = UserPrincipal.FindByIdentity(ADContextGeneral, userName);
            //PrincipalSearchResult<Principal> userGroups = user.GetAuthorizationGroups();

            Name = "Нагайцев Александр Евгеньевич";/* user.DisplayName; */

            //if (userGroups.Count() > 0)
            //{
            //    foreach(var group in userGroups)
            //    {
            //        Groups.Add(group.Name);
            //    }
            //}          

            Access access = new Access();
            var accessList = access.GetAccess();

            if (Groups.Contains(accessList.Where(al => al.Function == "fullView").Select(al => al.ADGroup).First()))
            {
                IsFullView = true;
            }

            if (Groups.Contains(accessList.Where(al => al.Function == "customizer").Select(al => al.ADGroup).First()))
            {
                IsConfigurator = true;
            }

            if (Groups.Contains(accessList.Where(al => al.Function == "admin").Select(al => al.ADGroup).First()))
            {
                IsAdministrator = true;
            }
        }
    }
}


            

            
             