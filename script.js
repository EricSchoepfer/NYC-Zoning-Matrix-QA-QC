// ==========================================================================
// NYC Custom Zoning Matrix Builder - Core Logic Engine (script.js)
// ==========================================================================

// 1. ZONING REPOSITORY AND FAR LOOKUP DICTIONARY (Sourced from NYCZR Text)
const zoningRules = {
  "R1":   { stdFar: 0.50, uapFar: 0.50, resUses: "Single-Family Detached", cfUses: "Basic Community Facilities" },
  "R2":   { stdFar: 0.50, uapFar: 0.50, resUses: "Single-Family Detached", cfUses: "Basic Community Facilities" },
  "R3":   { stdFar: 0.50, uapFar: 0.60, resUses: "Low-Rise Contextual", cfUses: "Ambulatory, Houses of Worship" },
  "R4":   { stdFar: 0.75, uapFar: 0.90, resUses: "Detached/Semi-Detached Rowhouses", cfUses: "Local Schools, Houses of Worship" },
  "R5":   { stdFar: 1.25, uapFar: 1.65, resUses: "Single/Two-Family Attached", cfUses: "Medical Offices, Houses of Worship" },
  "R6":   { stdFar: 2.20, uapFar: 3.60, resUses: "Medium-Density Apartments", cfUses: "Hospitals, Libraries, Schools" },
  "R6B":  { stdFar: 2.00, uapFar: 2.20, resUses: "Traditional Contextual Rowhouses", cfUses: "Neighborhood Assets" },
  "R7":   { stdFar: 3.44, uapFar: 4.60, resUses: "Medium-High Density Apartments", cfUses: "Healthcare, Large Institutions" },
  "R7-1": { stdFar: 3.44, uapFar: 4.60, resUses: "Height Factor / Quality Housing Profile", cfUses: "Ambulatory, Educational" },
  "R7A":  { stdFar: 4.00, uapFar: 4.60, resUses: "High-Density Quality Housing Apartments", cfUses: "Hospitals, Full Non-Profit Assets" },
  "R7X":  { stdFar: 5.00, uapFar: 6.00, resUses: "Contextual Multi-Family Envelopes", cfUses: "Medical Facilities, Schools, Libraries" },
  "R8":   { stdFar: 6.02, uapFar: 7.20, resUses: "High-Density Urban Apartments", cfUses: "Hospitals, Full Non-Profit Complexes" },
  "R10":  { stdFar: 10.00, uapFar: 12.00, resUses: "Maximum Density Urban Residential", cfUses: "Full Hospitals, Research Libraries" },
  "C4":   { stdFar: 3.40, uapFar: 4.00, resUses: "Mixed-Use Commercial-Residential", cfUses: "Care Assets, Local Training Spaces" },
  "C4-6": { stdFar: 10.00, uapFar: 12.00, resUses: "High-Bulk Commercial Skyscraper Core", cfUses: "Institutional Assets, Research Towers" },
  "M1":   { stdFar: 1.00, uapFar: 1.00, resUses: "🚫 Standalone Residential Prohibited", cfUses: "Performance Standard Facilities" }
};

// 2. DOM EVENT LISTENERS & INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
  // Setup Dynamic Input Adjusters
  document.getElementById("frontageCount").addEventListener("change", renderFrontageInputs);
  document.getElementById("hasBalconies").addEventListener("change", toggleBalconyFields);
  document.getElementById("balconyWallCount").addEventListener("change", renderBalconyWallInputs);
  document.getElementById("generateMatrixBtn").addEventListener("click", calculateZoningMatrix);

  // Initialize Default State Fields
  renderFrontageInputs();
  toggleBalconyFields();
});

// 3. DYNAMIC UI GENERATOR: STREET FRONTAGE TABS
function renderFrontageInputs() {
  const count = parseInt(document.getElementById("frontageCount").value) || 1;
  const container = document.getElementById("frontageInputsContainer");
  container.innerHTML = "";

  for (let i = 1; i <= count; i++) {
    const row = document.createElement("div");
    row.className = "search-grid";
    row.style.gridTemplateColumns = "repeat(auto-fit, minmax(180px, 1fr))";
    row.style.marginTop = "10px";
    row.style.padding = "10px";
    row.style.border = "1px solid var(--border-color)";
    row.style.borderRadius = "4px";

    row.innerHTML = `
      <div>
        <label><small>Frontage #${i} Type</small></label>
        <select class="frontage-type" style="margin-top:4px;">
          <option value="Wide">Wide Street (⚖️ ≥ 75 ft Width)</option>
          <option value="Narrow">Narrow Street (⚖️ < 75 ft Width)</option>
        </select>
      </div>
      <div>
        <label><small>Frontage #${i} Length (Linear Feet)</small></label>
        <input type="number" class="frontage-length" placeholder="Feet" value="100" min="0" style="margin-top:4px;">
      </div>
    `;
    container.appendChild(row);
  }
}

// 4. DYNAMIC UI GENERATOR: BALCONY WALL LOGIC
function toggleBalconyFields() {
  const hasBalconies = document.getElementById("hasBalconies").value === "Yes";
  const container = document.getElementById("balconyLogicContainer");
  
  if (hasBalconies) {
    container.style.display = "block";
    renderBalconyWallInputs();
  } else {
    container.style.display = "none";
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
    row.style.padding = "10px";
    row.style.border = "1px solid var(--border-color)";
    row.style.borderRadius = "4px";

    row.innerHTML = `
      <div>
        <label><small>Wall #${i} Total Width (ft)</small></label>
        <input type="number" class="balcony-wall-total" value="50" min="1" style="margin-top:4px;">
      </div>
      <div>
        <label><small>Provided Balcony Width (ft)</small></label>
        <input type="number" class="balcony-width" value="15" min="0" style="margin-top:4px;">
      </div>
    `;
    container.appendChild(row);
  }
}

// 5. CORE MATRIX COMPUTATION ENGINE
function calculateZoningMatrix() {
  // Fetch Primitive Inputs
  const primary = document.getElementById("primaryDistrict").value;
  const paired = document.getElementById("pairedDistrict").value;
  const overlay = document.getElementById("overlayDistrict").value;
  const special = document.getElementById("specialDistrict").value;
  const lotArea = parseFloat(document.getElementById("lotArea").value) || 0;
  const transitZone = document.getElementById("transitZone").value;
  const streetscapeTier = document.getElementById("streetscapeTier").value;
  const lotType = document.getElementById("lotType").value;

  if (!primary) {
    alert("Please select a Primary Zoning District to initiate calculations.");
    return;
  }

  // Baseline Fallback Object Configuration
  const baseRules = zoningRules[primary] || { stdFar: 1.0, uapFar: 1.0, resUses: "Standard", cfUses: "Standard" };
  
  // Calculate Base Multipliers
  let finalStdFar = baseRules.stdFar;
  let finalUapFar = baseRules.uapFar;
  let summaryNotes = [];

  // Apply Special District Overrides (Sourced from NYCZR Text)
  if (special !== "None") {
    summaryNotes.push(`⚠️ Special District Active: ${special}. Check custom modifications to underlying text.`);
    if (special === "Special Midtown District (MiD)") {
      finalStdFar = Math.max(finalStdFar, 10.0);
      finalUapFar = Math.max(finalUapFar, 12.0);
    }
  }

  // Calculate Square Footage Allowances
  const stdMaxZfa = Math.round(lotArea * finalStdFar);
  const uapMaxZfa = Math.round(lotArea * finalUapFar);

  // Parse Dynamically Generated Frontage Lengths
  let totalFrontageLength = 0;
  let wideStreetCount = 0;
  let narrowStreetCount = 0;
  
  const typeSelects = document.querySelectorAll(".frontage-type");
  const lengthInputs = document.querySelectorAll(".frontage-length");

  typeSelects.forEach((select, index) => {
    const len = parseFloat(lengthInputs[index].value) || 0;
    totalFrontageLength += len;
    if (select.value === "Wide") wideStreetCount++;
    else narrowStreetCount++;
  });

  // Calculate Land Use Tracks
  let tracks = [];
  if (document.getElementById("trackRes").value === "Residential") tracks.push("Residential (UG II)");
  if (document.getElementById("trackCf").value === "CommunityFacility") tracks.push("Community Facility");
  if (document.getElementById("trackComm").value === "Commercial") tracks.push("Commercial (UG VI)");
  const buildingTrackProfile = tracks.length > 0 ? tracks.join(" + ") : "No Use Program Specified";

  // Check Balcony Projection Envelopes
  let balconySummary = "No Balconies Provided";
  if (document.getElementById("hasBalconies").value === "Yes") {
    let totalWallWidth = 0;
    let totalBalconyWidth = 0;
    document.querySelectorAll(".balcony-wall-total").forEach(input => totalWallWidth += parseFloat(input.value) || 0);
    document.querySelectorAll(".balcony-width").forEach(input => totalBalconyWidth += parseFloat(input.value) || 0);
    
    const projectRatio = totalWallWidth > 0 ? ((totalBalconyWidth / totalWallWidth) * 100).toFixed(1) : 0;
    balconySummary = `${projectRatio}% Wall-Face Coverage (${totalBalconyWidth} ft of ${totalWallWidth} ft Total)`;
  }

  // Update DOM Workspace Sidebar Blocks
  document.getElementById("outZoning").innerText = `${primary} / ${overlay !== "None" ? overlay : "No Overlay"}`;
  document.getElementById("outSpecial").innerText = special !== "None" ? special : "None Appended";
  document.getElementById("outLotArea").innerText = `${lotArea.toLocaleString()} SF (${lotType} Lot)`;
  document.getElementById("outFrontages").innerText = `${wideStreetCount} Wide, ${narrowStreetCount} Narrow (${totalFrontageLength} Linear Feet)`;
  document.getElementById("outTransit").innerText = transitZone;
  document.getElementById("outStreetscape").innerText = streetscapeTier;

  // Update Dynamic Metrics Cards
  document.getElementById("lblStdFar").innerText = `${finalStdFar.toFixed(2)} FAR`;
  document.getElementById("lblStdMaxSf").innerText = `Base Capacity: ${stdMaxZfa.toLocaleString()} ZFA SF`;
  document.getElementById("lblUapFar").innerText = `${finalUapFar.toFixed(2)} FAR`;
  document.getElementById("lblUapMaxSf").innerText = `UAP Capacity: ${uapMaxZfa.toLocaleString()} ZFA SF`;

  // Render Use Cards Summary Texts
