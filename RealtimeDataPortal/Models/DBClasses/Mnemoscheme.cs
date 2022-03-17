namespace RealtimeDataPortal.Models.DBClasses
{
    public class Mnemoscheme
    {
        public int Id { get; set; }
        public int MnemoschemeId { get; set; }
        public string MnemoschemeContain { get; set; } = string.Empty;

        public int EditMnemoscheme(Mnemoscheme mnemoscheme)
        {
            using (RDPContext rdp_base = new())
            {
                rdp_base.Mnemoscheme.Update(mnemoscheme);
                rdp_base.SaveChanges();

                return mnemoscheme.Id;
            }
        }
    }

}
