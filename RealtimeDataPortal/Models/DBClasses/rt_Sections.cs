using Microsoft.EntityFrameworkCore;

namespace RealtimeDataPortal.Models
{
    public class rt_Sections
    {
        public int SectionId { get; set; }
        public string SectionName { get; set; } = string.Empty!;
        public int TableId { get; set; }

        public void AddChangeSections(List<rt_Sections> sections, int tableId, List<rt_SectionProduct> sectionProducts)
        {
            // Метод используется для добавления и редактирования таблицы rt_Sections.
            // Данные делятся на секции которые необходимо добавить/редактировать и те которые необходимо удалить
            // Для новых секций SectionId устанавливается в 0 (ранее им присваивались id для деления продуктов по
            // секциям)
            //

            using(RDPContext rdp_base = new())
            {
                List <rt_Sections> initialSections = rdp_base.rt_Sections
                    .Where(section => section.TableId == tableId)
                    .AsNoTracking()
                    .ToList();

                List<rt_SectionProduct> initialSectionProducts = rdp_base.rt_SectionProduct
                    .Where(product => initialSections
                    .Select(section => section.SectionId)
                    .Contains(product.SectionId))
                    .AsNoTracking()
                    .ToList();

                var deletingSections = initialSections
                    .Where(section =>
                        initialSections.Select(section => section.SectionId)
                        .Except(sections.Select(section => section.SectionId))
                        .Contains(section.SectionId))
                    .ToList();

                foreach(var section in sections)
                {
                    var sectionProduct = sectionProducts.Where(product => product.SectionId == section.SectionId).ToList();

                    section.TableId = tableId;

                    if(!initialSections.Select(section => section.SectionId).Contains(section.SectionId))
                    {
                        section.SectionId = 0;
                    }

                    rdp_base.rt_Sections.Update(section);
                    rdp_base.SaveChanges();

                    new rt_SectionProduct().AddChangeSectionProducts(section.SectionId, sectionProduct, initialSectionProducts);
                }

                foreach(var section in deletingSections)
                {
                    new rt_SectionProduct().AddChangeSectionProducts(section.SectionId, new(), initialSectionProducts);

                    rdp_base.rt_Sections.Remove(section);
                    rdp_base.SaveChanges();
                }
            }
        }
    }
}
