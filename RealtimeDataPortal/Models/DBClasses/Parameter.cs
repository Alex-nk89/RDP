using System.ComponentModel.DataAnnotations.Schema;

namespace RealtimeDataPortal.Models
{
    public class Parameter
    {
        public int ParameterId { get; set; }
        public int ProductId { get; set; }
        public int ParameterTypeId { get; set; }
        public string Position { get; set; } = string.Empty!;
        public int Round { get; set; }
        public bool ShowLimit { get; set; }

        public int GetMaxParameterId(RDPContext rdp_base)
        {
            return rdp_base.Parameter.Max(p => p.ParameterId);
        }

        public int AddParameter(Parameter addingParameter)
        {
            using(RDPContext rdp_base = new())
            {
                rdp_base.Parameter.Update(addingParameter);                
                rdp_base.SaveChanges();

                return addingParameter.ParameterId;
            }
        }

        public void RemoveParameter(List<Parameter> deletingParameters)
        {
            using(RDPContext rdp_base = new())
            {
                rdp_base.Parameter.RemoveRange(deletingParameters);
                rdp_base.SaveChanges();
            }
        }
    }
}
