
namespace RealtimeDataPortal.Models
{
    public class TagsType
    {
        public int TagTypeId { get; set; }
        public string Type { get; set; } = string.Empty;
        public string TypeShortName { get; set; } = string.Empty;
        public string TypeName { get; set; } = string.Empty;
        public int? WwResolution { get; set; }
        public string? Calendar { get; set; }
        public bool VisibleToGraphic { get; set; } = false;

        public List<TagsType> GetListTypesTag(string? name)
        {
            using (RDPContext rdp_base = new())
            {
                IQueryable<TagsType> listTypesTag = rdp_base.TagsType;

                if (name is not null)
                    listTypesTag = listTypesTag
                        .Where(typeTag => EF.Functions.Like(typeTag.TypeName, $"%{name}%")
                        || EF.Functions.Like(typeTag.Type, $"%{name}%")
                        || EF.Functions.Like(typeTag.TypeShortName, $"%{name}%"));

                return listTypesTag.AsNoTracking().ToList();
            }
        }

        public void EditTypeTag(TagsType tagType)
        {
            using (RDPContext rdp_base = new())
            {
                rdp_base.TagsType.Update(tagType);
                rdp_base.SaveChanges();
            }
        }

        public void DeleteTypeTag (int[] ids)
        {
            using(RDPContext rdp_base = new())
            {
                var deletingTypesTag = rdp_base.TagsType
                    .Where(typeTag => ids.Contains(typeTag.TagTypeId))
                    .AsNoTracking();

                rdp_base.TagsType.RemoveRange(deletingTypesTag);
                rdp_base.SaveChanges();
            }
        }
    }
}
