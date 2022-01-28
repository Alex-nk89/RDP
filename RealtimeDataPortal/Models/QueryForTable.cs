﻿namespace RealtimeDataPortal.Models
{
    public class QueryForTable
    {
        public string? TagName { get; set; } = string.Empty!;
        public double? Value { get; set; }
        public string? Unit { get; set; } = string.Empty!;
        public string? Scale { get; set; } = string.Empty!;
        public string? Limits { get; set; }
    }
}
