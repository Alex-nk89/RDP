using System.ComponentModel.DataAnnotations.Schema;

namespace RealtimeDataPortal.Models
{
    public class TreesMenu
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public int IdParent { get; set; }
        public string Type { get; set; } = null!;
        public int IdComponent { get; set; }
        [NotMapped]
        public bool isFullView { get; set; } = false;


        public List<TreesMenu> GetMenu(int idParent, bool isFullView = false)
        {
            using(RDPContext db = new RDPContext())
            {
                var menuItems = db.TreesMenu.Where(tm => tm.IdParent == idParent).OrderBy(tm => tm.Name).ToList();

                //if (!isFullView)
                //{

                //}

                return menuItems;
            }
        }
    }
}


//var listElements = (from tp in db.TreePlants
//                    join ac in db.Access on tp.Id equals ac.IdPage
//                    where tp.ParentId == parentId
//                    where GetGroups().IndexOf(ac.ADGroup) >= 0
//                    orderby tp.Name
//                    select new TreePlant()
//                    {
//                        Id = tp.Id,
//                        Name = tp.Name,
//                        ParentId = tp.ParentId,
//                        GraphicId = tp.GraphicId,
//                        TableId = tp.TableId,
//                        MnemoschemeId = tp.MnemoschemeId,
//                        ExternalPageId = tp.ExternalPageId,
//                        FullAccess = ac.IdChildren == 0 ? true : false
//                    })
//                                        .Distinct()
//                                        .AsNoTracking()
//                                        .ToList();

//from tp in db.TreePlants
//where tp.ParentId == parentId
//orderby tp.Name
//select new TreePlant()
//{
//    Id = tp.Id,
//    Name = tp.Name,
//    ParentId = tp.ParentId,
//    GraphicId = tp.GraphicId,
//    TableId = tp.TableId,
//    MnemoschemeId = tp.MnemoschemeId,
//    ExternalPageId = tp.ExternalPageId,
//    FullAccess = true
//}).AsNoTracking().ToList();