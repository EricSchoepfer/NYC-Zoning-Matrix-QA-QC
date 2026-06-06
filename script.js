const zoningRules = {
  "R1":   { stdFar: 0.50, uapFar: 0.50, resUses: "Single-Family Detached Homes", cfUses: "Basic Community Facilities" },
  "R2":   { stdFar: 0.50, uapFar: 0.50, resUses: "Single-Family Detached Homes", cfUses: "Basic Community Facilities" },
  "R3":   { stdFar: 0.50, uapFar: 0.60, resUses: "Low-Rise Contextual Multifamily", cfUses: "Ambulatory, Houses of Worship" },
  "R4":   { stdFar: 0.75, uapFar: 0.90, resUses: "Detached/Semi-Detached Rowhouses", cfUses: "Local Schools, Houses of Worship" },
  "R5":   { stdFar: 1.25, uapFar: 1.65, resUses: "Single/Two-Family Attached Units", cfUses: "Medical Offices, Community Hubs" },
  "R6":   { stdFar: 2.20, uapFar: 3.60, resUses: "Medium-Density Residential Complexes", cfUses: "Hospitals, Libraries, Schools" },
  "R6B":  { stdFar: 2.00, uapFar: 2.20, resUses: "Traditional Contextual Townhouses", cfUses: "Neighborhood Local Assets" },
  "R7":   { stdFar: 3.44, uapFar: 4.60, resUses: "Medium-High Density Apartment Frames", cfUses: "Healthcare, Large Service Buildings" },
  "R7-1": { stdFar: 3.44, uapFar: 4.60, resUses: "Height Factor / Quality Housing Track", cfUses: "Ambulatory Care, Educational Facilities" },
  "R7A":  { stdFar: 4.00, uapFar: 4.60, resUses: "High-Density Quality Housing Assets", cfUses: "Hospitals, Non-Profit Institutions" },
  "R7X":  { stdFar: 5.00, uapFar: 6.00, resUses: "High-Bulk Contextual Multi-Family Envelopes", cfUses: "Medical Research, Public Libraries" },
  "R8":   { stdFar: 6.02, uapFar: 7.20, resUses: "High-Density Core Urban Apartments", cfUses: "Hospitals, Academic Complexes" },
  "R10":  { stdFar: 10.00, uapFar: 12.00, resUses: "Maximum Density High-Rise Housing Towers", cfUses: "Full Research Hospitals, Libraries" },
  "C1":   { stdFar: 2.00, uapFar: 2.40, resUses: "Commercial Hub Mixed Residential", cfUses: "Local Neighborhood Retail Outlets" },
  "C2":   { stdFar: 2.00, uapFar: 2.40, resUses: "Commercial District Retail Layouts", cfUses: "Service Stations, Business Offices" },
  "C4":   { stdFar: 3.40, uapFar: 4.00, resUses: "Mixed-Use Commercial Office Footprints", cfUses: "Regional Malls, Training Centers" },
  "C4-6": { stdFar: 10.00, uapFar: 12.00, resUses: "High-Bulk Central Business Core Buildings", cfUses: "Commercial Skyscrapers, Health Towers" },
  "C5":   { stdFar: 10.00, uapFar: 12.00, resUses: "Central Commercial Skyscraper Profiles", cfUses: "Corporate Headquarters, Retail Hubs" },
  "C6":   { stdFar: 10.00, uapFar: 12.00, resUses: "High-Bulk Commercial Entertainment Zones", cfUses: "Theaters, Corporate Business Hubs" },
  "C7":   { stdFar: 2.00, uapFar: 2.00, resUses: "Amusement Parks & Large Recreation Units", cfUses: "Open Air Entertainment, Arenas" },
  "C8":   { stdFar: 1.00, uapFar: 1.00, resUses: "🚫 Standalone Residential Prohibited", cfUses: "Automotive Repair, Heavy Showrooms" },
  "M1":   { stdFar: 1.00, uapFar: 1.00, resUses: "🚫 Standalone Residential Prohibited", cfUses: "Light Industrial Performance Envelopes" },
  "M2":   { stdFar: 2.00, uapFar: 2.00, resUses: "🚫 Standalone Residential Prohibited", cfUses: "Medium Manufacturing Storage Yards" },
  "M3":   { stdFar: 3.00, uapFar: 3.00, resUses: "🚫 Standalone Residential Prohibited", cfUses: "Heavy Chemical Industrial Complexes" }
};

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("frontageCount").addEventListener("change", renderFrontageInputs);
  document.getElementById("hasBalconies").addEventListener("change", toggleBalconyFields);
  document.getElementById("balconyWallCount").addEventListener("change
