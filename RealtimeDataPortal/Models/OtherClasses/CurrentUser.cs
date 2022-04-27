using RealtimeDataPortal.Exceptions;
using System.DirectoryServices.AccountManagement;

namespace RealtimeDataPortal.Models.OtherClasses
{
    public class CurrentUser
    {
        public string? Name {  get; set; }
        public ICollection<string> ADGroups { get; set; } = new List<string>();
        public bool IsFullView { get; set; } = false;
        public bool IsConfigurator { get; set; } = false;
        public bool IsAdministrator { get; set; } = false;
        public bool IsConfiguratorRead { get; set; } = false;
        private static HttpContext _httpContext => new HttpContextAccessor().HttpContext;

        public void GetCurrentUser ()
        {
            CurrentUser currentUser = new();
            //Name = _httpContext.User?.Identity?.Name;
            Name = "NagaytsevAE";

            if (Name is null)
            {
                throw new Exception("NoGetUser");
            }

            PrincipalContext ADContextGeneral = new PrincipalContext(ContextType.Domain);
            UserPrincipal user = UserPrincipal.FindByIdentity(ADContextGeneral, Name);
            PrincipalSearchResult<Principal> userGroups = user.GetAuthorizationGroups();

            currentUser.Name = user.Name;

            if (userGroups.Count() > 0)
            {
                foreach (var group in userGroups)
                {
                    currentUser.ADGroups.Add(group.Name);
                }
            }

            var accessList = new AccessProfiles().GetAccessProfiles();

            currentUser.IsFullView = currentUser.ADGroups.Contains(accessList.First(a => a.Function == "fullView").ADGroup);
            currentUser.IsConfigurator = currentUser.ADGroups.Contains(accessList.First(a => a.Function == "customizer").ADGroup);
            currentUser.IsAdministrator = currentUser.ADGroups.Contains(accessList.First(a => a.Function == "admin").ADGroup);
            currentUser.IsConfiguratorRead = currentUser.ADGroups.Contains(accessList.First(a => a.Function == "customizerRead").ADGroup);

            _httpContext.Session.SetString("currentUser", JsonSerializer.Serialize(currentUser));
        }
    }
}
