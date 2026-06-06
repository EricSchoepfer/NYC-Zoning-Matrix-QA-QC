// ==========================================================================
// NYC Custom Zoning Matrix Builder - Master Calculator Engine (script.js)
// ==========================================================================

// 1. COMPREHENSIVE LAND USE FAR & RESOLUTION BOUNDARY LOOKUP DICTIONARY
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

// 2. DOM EVENT LIFECYCLE ROUTINES
document.addEventListener("DOMContentLoaded", () => {
  // Bind UI Generation Elements
  document.getElementById("frontageCount").addEventListener("change", renderFrontageInputs);
  document.getElementById("hasBalconies").addEventListener("change", toggleBalconyFields);
  document.getElementById("balconyWallCount").addEventListener("change", renderBalconyWallInputs);
  document.getElementById("generateMatrixBtn").addEventListener("click", calculateZoningMatrix);

  // Core App Initializations
  renderFrontageInputs();
  toggleBalconyFields();
});

// 3. FRONTEND INTERACTIVE GENERATOR: STREET FRONTAGES
function renderFrontageInputs() {
  const count = parseInt(document.getElementById("frontageCount").value) || 1;
  const container = document.getElementById("frontageInputsContainer");
  container.innerHTML = "";

  for (let i = 1; i <= count; i++) {
    const row = document.createElement("div");
    row.className = "search-grid";
    row.style.gridTemplateColumns = "repeat(auto-fit, minmax(180px, 1fr))";
    row.style.marginTop = "12px";
    row.style.padding = "10px";
    row.style.background = "#f9fafb";
    row.style.border = "1px solid var(--border-color)";
    row.style.borderRadius = "4px";

    row.innerHTML = `
      <div>
        <label><small>Frontage #${i} Boundary Profile</small></label>
        <select class="frontage-type" style="margin-top:4px;">
          <option value="Wide">Wide Street (⚖️ Width ≥ 75 ft)</option>
          <option value="Narrow">Narrow Street (⚖️ Width < 75 ft)</option>
        </select>
      </div>
      <div>
        <label><small>Frontage #${i} Length (Linear Feet)</small></label>
        <input type="number" class="frontage-length" value="100" min="0" style="margin-top:4px;">
      </div>
    `;
    container.appendChild(row);
  }
}

// 4. FRONTEND INTERACTIVE GENERATOR: BALCONIES
function toggleBalconyFields() {
  const hasBalconies = document.getElementById("hasBalconies").value === "Yes";
  const container = document.getElementById("balconyLogicContainer");
  const countWrapper = document.getElementById("balconyWallCountWrapper");
  
  if (hasBalconies) {
    container.style.display = "block";
    countWrapper.style.display = "block";
    renderBalconyWallInputs();
  } else {
    container.style.display = "none";
    countWrapper.style.display = "none";
  }
}

function renderBalconyWallInputs() {
  const count = parseInt(document.getElementById("balconyWallCount").value) || 1;
  const container = document.getElementById("balconyWallsContainer");
  container.innerHTML = "";

  for (let i = 1; i <= count; i++) {
    const row = document.createElement("div");
    row.className = "search-grid";
    row.style.gridTemplateColumns = "repeat(auto-fit, minmax(180px, 1fr))";
    row.style.marginTop = "10px";
    row.style.padding = "8px";
    row.style.borderBottom = "1px dashed var(--border-color)";

    row.innerHTML = `
      <div>
        <label><small>Wall #${i} Linear Width (ft)</small></label>
        <input type="number" class="balcony-wall-total" value="60" min="1" style="margin-top:4px;">
      </div>
      <div>
        <label><small>Projected Balcony Width (ft)</small></label>
        <input type="number" class="balcony-width" value="20" min="0" style="margin-top:4px;">
      </div>
    `;
    container.appendChild(row);
  }
}

// 5. MASTER BLUEPRINT CALCULATOR LOGIC
function calculateZoningMatrix() {
  // Capture Form Elements
  const primary = document.getElementById("primaryDistrict").value;
  const paired = document.getElementById("pairedDistrict").value;
  const overlay = document.getElementById("overlayDistrict").value;
  const special = document.getElementById("specialDistrict").value;
  const lotArea = parseFloat(document.getElementById("lotArea").value) || 0;
  const lotType = document.getElementById("lotType").value;
  const transitZone = document.getElementById("transitZone").value;
  const streetscapeTier = document.getElementById("streetscapeTier").value;

  if (!primary) {
    alert("Please assign a primary target zoning district to execute calculation runs.");
    return;
  }

  // Setup Timestamps
  document.getElementById("timestamp").innerText = "RETRIEVED BLUEPRINT ANALYSIS RUN: " + new Date().toLocaleString();

  // Load Dictionary Multipliers
  const baseRules = zoningRules[primary] || { stdFar: 1.0, uapFar: 1.0, resUses: "Standard Allowances", cfUses: "Standard Facilities" };
  
  let finalStdFar = baseRules.stdFar;
  let finalUapFar = baseRules.uapFar;

  // Handle Paired Industrial District Overrides (ZR 123-11)
  if (paired !== "None") {
    const pairedParts = paired.split("/");
    if (pairedParts.length === 2 && zoningRules[pairedParts[1]]) {
      finalStdFar = zoningRules[pairedParts[1]].stdFar;
      finalUapFar = zoningRules[pairedParts[1]].uapFar;
    }
  }

  // Handle High Bulk Special District Multipliers (Sourced from NYCZR Text)
  if (special.includes("Midtown")) {
    finalStdFar = Math.max(finalStdFar, 10.0);
    finalUapFar = Math.max(finalUapFar, 12.0);
  } else if (special.includes("Downtown Brooklyn")) {
    finalStdFar = Math.max(finalStdFar, 12.0);
    finalUapFar = Math.max(finalUapFar, 14.0);
  }

  // Final Square Footage Metrics Calculations
  const stdMaxZfa = Math.round(lotArea * finalStdFar);
  const uapMaxZfa = Math.round(lotArea * finalUapFar);

  // Compute Active Frontages List Items
  let totalFrontageLength = 0;
  let wideCount = 0;
  let narrowCount = 0;
  
  const typeSelects = document.querySelectorAll(".frontage-type");
  const lengthInputs = document.querySelectorAll(".frontage-length");

  typeSelects.forEach((select, index) => {
    const lengthVal = parseFloat(lengthInputs[index].value) || 0;
    totalFrontageLength += lengthVal;
    if (select.value === "Wide") wideCount++;
    else narrowCount++;
  });

  // Calculate Balcony Linear Space Distributions
  let balconySummary = "No Surface Obstructions Appended";
  if (document.getElementById("hasBalconies").value === "Yes") {
    let combinedWallWidth = 0;
    let combinedBalconyWidth = 0;
    document.querySelectorAll(".balcony-wall-total").forEach(input => combinedWallWidth += parseFloat(input.value) || 0);
    document.querySelectorAll(".balcony-width").forEach(input => combinedBalconyWidth += parseFloat(input.value) || 0);
    
