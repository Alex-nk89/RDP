﻿using Microsoft.EntityFrameworkCore;

namespace RealtimeDataPortal.Models
{
    public class ParameterType
    {
        public int ParameterTypeId { get; set; }
        public string ParameterTypeName { get; set; } = string.Empty;
        public string Label { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;

        public List<ParameterType> GetParameterTypes(RDPContext rdp_base)
        {
            return rdp_base.ParameterType.ToList();
        }

        public List<ParameterType> GetListParameterTypes(string name)
        {
            using (RDPContext rdp_base = new())
            {
                var listParameterTypes = rdp_base.ParameterType
                    .Where(type => EF.Functions.Like(type.ParameterTypeName, $"%{name}%") 
                        || EF.Functions.Like(type.Label, $"%{name}%"))
                    .AsNoTracking()
                    .ToList();

                return listParameterTypes;
            }
        }

        public void EditParameterType(ParameterType parameterType)
        {
            using(RDPContext rdp_base = new())
            {
                rdp_base.ParameterType.Update(parameterType);
                rdp_base.SaveChanges();
            }
        }

        public void DeleteParameterTypes (int[] ids)
        {
            using RDPContext rdp_base = new();

            var deletingParameterTypes = rdp_base.ParameterType
                .Where(parameter => ids.Contains(parameter.ParameterTypeId))
                .AsNoTracking();

            rdp_base.ParameterType.RemoveRange(deletingParameterTypes);
            rdp_base.SaveChanges();
        }
    }
}
