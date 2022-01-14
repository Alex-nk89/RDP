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
            using(RDPContext rdp_base = new RDPContext())
            {
                bool isAlreadyExist = rdp_base.AccessToComponent
                    .Where(atc => atc.IdComponent == idComponent && atc.IdChildren == idChildren && atc.ADGroupToAccess == adGroupToAccess)
                    .Count() == 0 ? true : false;

                if(isAlreadyExist)
                {
                    AccessToComponent accessToComponent = new AccessToComponent() { 
                        IdComponent = idComponent,
                        IdChildren = idChildren,
                        ADGroupToAccess = adGroupToAccess
                    };

                    rdp_base.AccessToComponent.Add(accessToComponent);

                    idChildren = idComponent;
                    idComponent = rdp_base.TreesMenu.Where(tm => tm.Id == idComponent).Select(tm => tm.IdParent).First();

                    if(idComponent != 0)
                        AddAccessToComponent(idComponent, idChildren, adGroupToAccess);
                }

                rdp_base.SaveChanges();
            } 
        }

        public void DeleteAccessToComponent(int idComponent, int? idChildren, string adGroupToAccess)
        {
            using(RDPContext rdp_base = new RDPContext())
            {
                List<AccessToComponent> accessToComponent = rdp_base.AccessToComponent
                    .Where(atc => atc.IdComponent == idComponent && atc.IdChildren == idChildren && atc.ADGroupToAccess == adGroupToAccess)
                    .ToList();

                rdp_base.AccessToComponent.RemoveRange(accessToComponent);
                rdp_base.SaveChanges();

                int idParent = rdp_base.TreesMenu.Where(tm => tm.Id == tm.IdComponent).Select(tm => tm.IdParent).First();
                int countChildren = rdp_base.TreesMenu.Where(tm => tm.IdParent == idParent).Count();

                if(countChildren == 1)
                {
                    DeleteAccessToComponent(idParent, idComponent, adGroupToAccess);
                }
            }
        }
    }
}
