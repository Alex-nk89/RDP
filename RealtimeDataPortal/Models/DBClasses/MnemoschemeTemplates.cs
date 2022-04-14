namespace RealtimeDataPortal.Models.DBClasses
{
    public class MnemoschemeTemplates
    {
        public int TemplateId { get; set; }
        public string TemplateName { get; set; } = String.Empty;
        public string TemplateContain { get; set; } = String.Empty;

        public List<MnemoschemeTemplates> GetTemplates(int id)
        {
            using(RDPContext rdp_base = new())
            {
                IQueryable<MnemoschemeTemplates> mnemoschemeTemplates =
                    rdp_base.MnemoschemeTemplates;

                if(id > 0)
                {
                    mnemoschemeTemplates = mnemoschemeTemplates.Where(m => m.TemplateId == id);
                }

                return mnemoschemeTemplates.ToList();
            }
        }

        public void SaveMnemoschemeTemplate(MnemoschemeTemplates template)
        {
            using(RDPContext rdp_base = new())
            {
                rdp_base.MnemoschemeTemplates.Add(template);
                rdp_base.SaveChanges();
            }
        }

        public void DeleteMnemoschemeTemplate(int id)
        {
            using(RDPContext rdp_base = new())
            {
                MnemoschemeTemplates? deletedTemplate = rdp_base.MnemoschemeTemplates
                    .Where(m => m.TemplateId == id)
                    .FirstOrDefault();

                if(deletedTemplate is not null)
                {
                    rdp_base.MnemoschemeTemplates.Remove(deletedTemplate);
                    rdp_base.SaveChanges();
                }
            }
        }
    }
}
