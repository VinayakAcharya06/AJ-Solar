import { jsPDF } from 'jspdf';
import { HomeConfig, SystemConfig, FinancialBreakdown, ProposalInfo, DISCO_INFO } from '../types/solar';
import { PANEL_SPECS, BATTERY_SPECS, INVERTER_SPECS, formatPkr } from './calculations';

export function generateProposalPdf(
  proposal: ProposalInfo,
  home: HomeConfig,
  system: SystemConfig,
  financials: FinancialBreakdown
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  // Background Top Header (Dark Obsidian Banner)
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 44, 'F');

  // Glowing solar gold top border line
  doc.setFillColor(250, 204, 21); // amber-400
  doc.rect(0, 0, pageWidth, 3.5, 'F');

  // Brand Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text('AJ', margin, 22);

  doc.setTextColor(250, 204, 21);
  doc.text('Solar Pakistan', margin + 14, 22);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(148, 163, 184);
  doc.text('AEDB Certified Solar EPC · NEPRA Bi-Directional Net Metering Specialists', margin, 29);
  doc.text('Lead Engineer: Engr. Vinayak · vinayakacharya376@gmail.com | Helpline: +92 (300) 845-SOLAR', margin, 35);

  // Proposal Metadata
  const todayStr = new Date().toLocaleDateString('en-PK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const proposalId = `AJS-PK-${Math.floor(100000 + Math.random() * 900000)}`;

  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  doc.text(`Proposal Ref: ${proposalId}`, pageWidth - margin, 18, { align: 'right' });
  doc.text(`Quotation Date: ${todayStr}`, pageWidth - margin, 24, { align: 'right' });
  doc.text(`DISCO Grid: ${home.disco}`, pageWidth - margin, 30, { align: 'right' });
  doc.text('Validity: 14 Days (Due to Currency/Metal Rates)', pageWidth - margin, 36, { align: 'right' });

  // Client Details Box
  let yPos = 52;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, yPos, contentWidth, 32, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('CLIENT & PROPERTY SITE AUDIT', margin + 6, yPos + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text(`Client Name: ${proposal.clientName || 'Respected Homeowner'}`, margin + 6, yPos + 15);
  doc.text(`Site Address: ${proposal.propertyAddress || 'Residential Property'}`, margin + 6, yPos + 21);
  doc.text(`City & DISCO: ${home.city || proposal.city || 'Hyderabad'} (${DISCO_INFO[home.disco].fullName})`, margin + 6, yPos + 27);

  // Right column of client box
  const plotLabel =
    home.plotSize === '5_marla' ? '5 Marla' :
    home.plotSize === '10_marla' ? '10 Marla' :
    home.plotSize === '1_kanal' ? '1 Kanal' :
    home.plotSize === '2_kanal' ? '2 Kanal' : 'Commercial';

  doc.text(`Plot / Roof Area: ${plotLabel} (~${home.homeSizeSqFt.toLocaleString()} sq.ft)`, margin + 95, yPos + 15);
  doc.text(`Avg WAPDA Bill: Rs. ${home.monthlyBill.toLocaleString()}/mo (@ Rs. ${home.electricityRateKwh}/unit)`, margin + 95, yPos + 21);
  doc.text(`Consumer Ref #: ${proposal.discoConsumerNumber || '24-11234-9876543-U'}`, margin + 95, yPos + 27);

  // Section 1: System Hardware Specifications
  yPos = 92;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('1. Engineered System Components & Hardware Bill of Materials', margin, yPos);

  yPos += 5;
  doc.setDrawColor(250, 204, 21);
  doc.setLineWidth(0.8);
  doc.line(margin, yPos, margin + 55, yPos);
  yPos += 7;

  const panel = PANEL_SPECS[system.panelTier];
  const battery = BATTERY_SPECS[system.batteryPack];
  const inverter = INVERTER_SPECS[system.inverterTier];

  const hardwareRows = [
    {
      component: 'Tier-1 Solar Photovoltaic Modules',
      specs: `${system.solarCapacityKw.toFixed(1)} kW DC Peak (${Math.round(system.solarCapacityKw * 1.7)} Modules)`,
      brand: panel.name,
      warranty: panel.warranty,
    },
    {
      component: 'Smart Hybrid / On-Grid Inverter',
      specs: `${system.solarCapacityKw.toFixed(0)} kW Dual MPPT IP65`,
      brand: inverter.name,
      warranty: '5-Year Manufacturer Replacement Warranty',
    },
    {
      component: 'Battery Storage (Load Shedding Backup)',
      specs: battery.capacityKwh > 0 ? `${battery.capacityKwh} kWh (${battery.backupHours}h Autonomy)` : 'No Battery (Standard On-Grid)',
      brand: battery.name,
      warranty: battery.capacityKwh > 0 ? '5-Year Smart BMS Warranty' : 'N/A',
    },
    {
      component: 'Structure & Mounting Hardware',
      specs: 'Custom L2/L3 Heavy Duty Hot-Dip Galvanized Iron (GI)',
      brand: 'Engineered for 140 km/h Wind Speed Resistance',
      warranty: '10-Year Rust & Corrosion Guarantee',
    },
    {
      component: 'Earthing & Protection Suite',
      specs: 'Dual Copper Earthing Bore Pit (Lightning & Surge Arrestors)',
      brand: 'Schneider / Terasaki AC & DC Circuit Breakers + Class-II SPD',
      warranty: 'Meets NEPRA Regulation Standards',
    },
    {
      component: 'NEPRA Green Meter & DISCO Licensing',
      specs: 'Turnkey Bi-Directional 3-Phase Meter Process',
      brand: `${home.disco} Net Metering Approval & Commissioning`,
      warranty: 'Official Net Metering License Included',
    },
  ];

  doc.setDrawColor(226, 232, 240);
  doc.setFontSize(8.5);
  hardwareRows.forEach((item) => {
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, yPos, contentWidth, 12, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text(item.component, margin + 4, yPos + 5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(item.specs, margin + 70, yPos + 5);

    doc.setTextColor(100, 116, 139);
    doc.text(`${item.brand} · ${item.warranty}`, margin + 4, yPos + 9.5);

    yPos += 14;
  });

  // Section 2: Investment Breakdown in PKR
  yPos += 2;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('2. Financial Turnkey Quotation & Net Metering Investment', margin, yPos);

  yPos += 5;
  doc.line(margin, yPos, margin + 55, yPos);
  yPos += 7;

  const costLines = [
    { label: 'Tier-1 Solar Panels & Inverter Complete Hardware', amount: `Rs. ${(system.solarCapacityKw * 1000 * panel.costPerWattPkr + system.solarCapacityKw * inverter.costPerKwPkr).toLocaleString()}` },
    { label: 'Battery Energy Storage Pack (Crown / itel / Tubular)', amount: battery.costPkr > 0 ? `Rs. ${battery.costPkr.toLocaleString()}` : 'Rs. 0 (Excluded)' },
    { label: 'Custom GI Mounting Structure, High-Grade Copper Cabling & BOS', amount: `Rs. ${(120000 + system.solarCapacityKw * 18000).toLocaleString()}` },
    { label: 'Earthing Pit Bores, Installation Labor, Testing & Commissioning', amount: `Rs. ${(65000 + system.solarCapacityKw * 8000).toLocaleString()}` },
    { label: 'NEPRA Bi-Directional Green Meter Processing & DISCO Fees', amount: `Rs. ${financials.nepraNetMeteringFeePkr.toLocaleString()}` },
    { label: 'Total Turnkey Package Investment (PKR)', amount: `Rs. ${financials.grossSystemCostPkr.toLocaleString()} (${formatPkr(financials.grossSystemCostPkr)})`, isTotal: true },
  ];

  costLines.forEach((line) => {
    if (line.isTotal) {
      doc.setFillColor(254, 240, 138); // light yellow
      doc.setDrawColor(234, 179, 8);
      doc.roundedRect(margin, yPos, contentWidth, 9.5, 1.5, 1.5, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
    }

    doc.text(line.label, margin + 4, yPos + 6);
    doc.setFont('helvetica', 'bold');
    doc.text(line.amount, pageWidth - margin - 4, yPos + 6, { align: 'right' });
    yPos += 10;
  });

  // Section 3: Return on Investment & Monthly Savings
  yPos += 4;
  doc.setFillColor(240, 253, 244); // light green
  doc.setDrawColor(34, 197, 94);
  doc.roundedRect(margin, yPos, contentWidth, 24, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(21, 128, 61);
  doc.text('ESTIMATED FINANCIAL SAVINGS & PAYBACK FORECAST', margin + 6, yPos + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);

  const colWidth = contentWidth / 3;
  // Col 1
  doc.text('Current WAPDA Bill:', margin + 6, yPos + 13);
  doc.setFont('helvetica', 'bold');
  doc.text(`Rs. ${financials.currentMonthlyBillPkr.toLocaleString()}/mo`, margin + 6, yPos + 18);

  // Col 2
  doc.setFont('helvetica', 'normal');
  doc.text('Est. Bill After Solar:', margin + colWidth + 6, yPos + 13);
  doc.setFont('helvetica', 'bold');
  doc.text(`Rs. ${financials.newMonthlyBillPkr.toLocaleString()}/mo (Save Rs. ${(financials.currentMonthlyBillPkr - financials.newMonthlyBillPkr).toLocaleString()}/mo)`, margin + colWidth + 6, yPos + 18);

  // Col 3
  doc.setFont('helvetica', 'normal');
  doc.text('Estimated Payback Period:', margin + colWidth * 2 + 6, yPos + 13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(22, 101, 52);
  doc.text(`${financials.paybackPeriodYears} Years (${formatPkr(financials.lifetime25YearSavingsPkr)} 25-Yr Profit)`, margin + colWidth * 2 + 6, yPos + 18);

  // Engineer Certification Box
  yPos += 26;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, yPos, contentWidth, 13, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Prepared & Certified By: Engr. Vinayak · Lead Solar EPC & NEPRA Specialist', margin + 4, yPos + 5.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('Official Email: vinayakacharya376@gmail.com | Helpline / WhatsApp: +92 (300) 845-SOLAR', margin + 4, yPos + 10);

  // Footer / Terms
  yPos += 18;
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'Note: Solar quotation valid subject to site roof structural feasibility. Net metering timelines depend on DISCO/NEPRA meter availability. Payment terms: 50% advance, 40% on delivery, 10% after commissioning.',
    margin,
    yPos
  );

  const clientClean = (proposal.clientName || 'Client').replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`AJ_Solar_Pakistan_Quotation_${clientClean}.pdf`);
}
