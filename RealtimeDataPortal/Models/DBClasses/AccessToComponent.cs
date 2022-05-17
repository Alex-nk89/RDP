namespace RealtimeDataPortal.Models
{
    public class AccessToComponent
    {
        public int Id { get; set; }
        public int IdComponent { get; set; }
        public int? IdChildren { get; set; }
        public string ADGroupToAccess { get; set; } = null!;

        // Добавление доступов
        // 1. Проверяем что такой записи нет в базе
        // 2. Добавляем доступ для компонента
        // 3. Если элемент не является корневым, то поднимаемся на уровень выше и повторяем операцию для родительской папки
        // 4. Повторяем добавление доступа для всехродителей покане будет достигнут корневой элемент
        // Удаление доступов происходит аналогичным образом, только добавляется проверка что родитель не имеет других дочерних
        // элементов с таким же доступом
        public void AddAccessToComponent(int idComponent, int? idChildren, string adGroupToAccess)
        {
            using (RDPContext rdp_base = new RDPContext())
            {
                bool isAlreadyExist = rdp_base.AccessToComponent
                    .Where(atc => atc.IdComponent == idComponent && atc.IdChildren == idChildren && atc.ADGroupToAccess == adGroupToAccess)
                    .Count() == 0 ? true : false;

                if (isAlreadyExist)
                {
                    AccessToComponent accessToComponent = new AccessToComponent()
                    {
                        IdComponent = idComponent,
                        IdChildren = idChildren,
                        ADGroupToAccess = adGroupToAccess
                    };

                    rdp_base.AccessToComponent.Add(accessToComponent);

                    idChildren = idComponent;
                    idComponent = rdp_base.TreesMenu.Where(tm => tm.Id == idComponent).Select(tm => tm.ParentId).First();

                    if (idComponent != 0)
                        AddAccessToComponent(idComponent, idChildren, adGroupToAccess);
                }

                rdp_base.SaveChanges();
            }
        }

        public void DeleteAccessToComponent(int idComponent, int? idChildren, string adGroupToAccess)
        {
            using (RDPContext rdp_base = new RDPContext())
            {
                AccessToComponent accessToComponent = rdp_base.AccessToComponent
                    .Where(atc => atc.IdComponent == idComponent
                        && atc.IdChildren == idChildren
                        && atc.ADGroupToAccess == adGroupToAccess)
                    .FirstOrDefault() ?? new();

                if (accessToComponent.Id != 0)
                {
                    rdp_base.AccessToComponent.Remove(accessToComponent);
                    rdp_base.SaveChanges();

                    int idParent = rdp_base.TreesMenu.Where(tm => tm.Id == idComponent).Select(tm => tm.ParentId).First();

                    var childrens =
                        (from treeMenu in rdp_base.TreesMenu
                         join access in rdp_base.AccessToComponent
                            on treeMenu.Id equals access.IdComponent into accesses
                         from access in accesses.DefaultIfEmpty()
                         where access.IdComponent == idParent
                            && access.ADGroupToAccess == adGroupToAccess
                         select
                            new { treeMenu.Id, treeMenu.ParentId, access.IdComponent, access.IdChildren })
                                               .Distinct().ToList();

                    if (childrens.Count == 1)
                    {
                        DeleteAccessToComponent(idParent, idComponent, adGroupToAccess);
                    }
                    else
                    {
                        accessToComponent = rdp_base.AccessToComponent
                            .Where(atc => atc.IdComponent == idParent)
                            .Where(atc => atc.IdChildren == idComponent)
                            .Where(atc => atc.ADGroupToAccess == adGroupToAccess)
                            .FirstOrDefault() ?? new();

                        if (accessToComponent.IdChildren != 0 && accessToComponent.IdChildren != null)
                        {
                            rdp_base.AccessToComponent.Remove(accessToComponent);
                            rdp_base.SaveChanges();
                        }
                    }

                }
            }
        }

        public string[] GetComponentGroups(int idComponent, int? idChildren)
        {
            using RDPContext rdp_base = new();

            string[] componentGroups =
                (from groups in rdp_base.AccessToComponent
                 where (groups.IdComponent == idComponent && groups.IdChildren == idChildren)
                 select groups.ADGroupToAccess)
                 .ToArray();

            return componentGroups;
        }

        public void EditAccessElement (int id, int? idChildren, string[] adGroups, string[] adGroupsOld)
        {
            string[] addedAccesses = adGroups.Except(adGroupsOld).ToArray();

            foreach (var addedAccess in addedAccesses)
            {
                AddAccessToComponent(id, idChildren, addedAccess);
            }

            string[] deletedAccesses = adGroupsOld.Except(adGroups).ToArray();

            foreach (var deletedAccess in deletedAccesses)
            {
                DeleteAccessToComponent(id, idChildren, deletedAccess);
            }
        }
    }
}