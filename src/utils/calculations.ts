import { HomeConfig, SystemConfig, FinancialBreakdown, MonthlyDataPoint } from '../types/solar';

export const PANEL_SPECS = {
  longi_himo7: {
    name: 'Longi Hi-MO 7 / Hi-MO X6 Tier-1 N-Type (585W–620W)',
    efficiency: '22.8%',
    costPerWattPkr: 38,
    warranty: '25-Year Linear Power Warranty (Tier-1 Bloomberg)',
    description: 'Pakistan’s #1 trusted Tier-1 photovoltaic module with anti-dust coating and high heat resistance.',
  },
  jinko_tiger_neo: {
    name: 'Jinko Solar Tiger Neo TOPCon (585W–610W)',
    efficiency: '23.2%',
    costPerWattPkr: 39,
    warranty: '30-Year Performance & 12-Year Product Warranty',
    description: 'World record efficiency N-type silicon with low degradation in extreme Pakistani summer heat.',
  },
  canadian_solar_topcon: {
    name: 'Canadian Solar TOPHiKu6 Super Power (590W)',
    efficiency: '22.5%',
    costPerWattPkr: 37,
    warranty: '25-Year Power Guarantee',
    description: 'Rugged heavy-duty frame engineered for harsh dust, wind loads, and monsoon rain storms.',
  },
};

export const BATTERY_SPECS = {
  none: {
    name: 'On-Grid Only (NEPRA Green Meter — No Battery)',
    capacityKwh: 0,
    costPkr: 0,
    backupHours: 0,
    type: 'Grid-Tied',
    description: 'Surplus units sold back to WAPDA / K-Electric. Shuts down during load shedding.',
  },
  itel_lifepo4_5kwh: {
    name: 'itel Green Energy 5.12 kWh LiFePO4 Smart Battery (48V 100Ah)',
    capacityKwh: 5.12,
    costPkr: 385000,
    backupHours: 10,
    type: 'Lithium LiFePO4',
    description: 'Compact wall-mounted smart battery. Runs fans, lights, refrigerator, Wi-Fi & TV during load shedding.',
  },
  crown_lifepo4_10kwh: {
    name: 'Crown Micro Elego 10.24 kWh LiFePO4 Heavy Duty Bank',
    capacityKwh: 10.24,
    costPkr: 695000,
    backupHours: 18,
    type: 'Lithium LiFePO4',
    description: 'High-amperage Crown lithium system. Powers 1.5-ton Inverter AC, water pump & all home circuits seamlessly.',
  },
  crown_tubular_lead: {
    name: 'Crown Heavy Duty Tubular Deep Cycle Bank (4x 200Ah C10)',
    capacityKwh: 4.8,
    costPkr: 210000,
    backupHours: 8,
    type: 'Tubular Deep Cycle',
    description: 'Cost-effective heavy tubular battery bank specially designed for frequent Pakistani load shedding cycles.',
  },
  narada_pylontech_15kwh: {
    name: 'Inverex / Narada 15.36 kWh High-Density Lithium Fortress',
    capacityKwh: 15.36,
    costPkr: 995000,
    backupHours: 28,
    type: 'Lithium LiFePO4',
    description: 'Multi-AC whole house backup with 6000+ deep discharge cycles and 10-year design life.',
  },
};

export const INVERTER_SPECS = {
  inverex_nitrox: {
    name: 'Inverex Nitrox Smart Hybrid Inverter (IP65 Dual MPPT)',
    efficiency: '98.5%',
    costPerKwPkr: 32000,
    description: 'Pakistan’s top-selling hybrid inverter. Seamless zero-millisecond UPS handover for uninterrupted living.',
  },
  knox_krypton: {
    name: 'Knox Krypton Smart Dual Output On-Grid / Hybrid',
    efficiency: '98.0%',
    costPerKwPkr: 28000,
    description: 'Built-in Wi-Fi cloud telemetry, surge protection, and high-voltage PV input handling.',
  },
  growatt_sph: {
    name: 'Growatt SPH European Standard Hybrid Inverter',
    efficiency: '98.2%',
    costPerKwPkr: 34000,
    description: 'German design engineering with dual independent battery ports and silent convection cooling.',
  },
};

export function calculateFinancials(home: HomeConfig, system: SystemConfig): FinancialBreakdown {
  // Monthly units consumed (kWh) = Bill / (PKR per unit rate)
  // In Pakistan, tariffs average Rs. 55 to Rs. 75 per unit with fuel adjustment
  const unitRate = Math.max(40, home.electricityRateKwh);
  const monthlyUnits = home.monthlyBill / unitRate;
  const annualConsumptionUnits = Math.round(monthlyUnits * 12);

  // Pakistan has exceptionally high solar irradiance (averages 1,550 to 1,650 peak units per kW per year)
  const sunExposureFactor =
    home.sunExposure === 'full_unshaded' ? 1.0 :
    home.sunExposure === 'partial_parapet_shade' ? 0.90 : 0.80;

  const annualProductionUnits = Math.round(system.solarCapacityKw * 1550 * sunExposureFactor);
  const solarOffsetPercent = Math.min(250, Math.round((annualProductionUnits / annualConsumptionUnits) * 100));

  // Gross Hardware & Installation Costs in PKR
  const panelCostPkr = system.solarCapacityKw * 1000 * PANEL_SPECS[system.panelTier].costPerWattPkr;
  const inverterCostPkr = system.solarCapacityKw * INVERTER_SPECS[system.inverterTier].costPerKwPkr;
  const batteryCostPkr = BATTERY_SPECS[system.batteryPack].costPkr;
  
  // Custom galvanized iron (GI) / aluminum L2/L3 mounting structures, copper wiring, AC/DC breakers, earthing bore pit
  const mountingAndElectricalPkr = 120000 + (system.solarCapacityKw * 18000);
  const installationLaborAndTestingPkr = 65000 + (system.solarCapacityKw * 8000);

  // NEPRA green meter DISCO testing, inspection, and bi-directional meter fee
  const nepraNetMeteringFeePkr = 85000;

  const grossSystemCostPkr = Math.round(
    panelCostPkr +
    inverterCostPkr +
    batteryCostPkr +
    mountingAndElectricalPkr +
    installationLaborAndTestingPkr +
    nepraNetMeteringFeePkr
  );

  const netSystemCostPkr = grossSystemCostPkr;

  // Islamic Bank Solar Financing (e.g. Meezan Bank Solar Financing / Bank Alfalah Green Energy)
  // Typically 3 years or 5 years at subsidized or KIBOR rates
  const loanTermMonths = system.loanTermYears * 12;
  const monthlyLoanRate = (system.loanApr / 100) / 12;
  let monthlyLoanPaymentPkr = 0;
  if (monthlyLoanRate > 0) {
    monthlyLoanPaymentPkr = Math.round(
      (netSystemCostPkr * (monthlyLoanRate * Math.pow(1 + monthlyLoanRate, loanTermMonths))) /
      (Math.pow(1 + monthlyLoanRate, loanTermMonths) - 1)
    );
  } else {
    monthlyLoanPaymentPkr = Math.round(netSystemCostPkr / loanTermMonths);
  }

  // Monthly Bills in PKR
  const currentMonthlyBillPkr = Math.round(home.monthlyBill);
  const remainingFraction = Math.max(0, 1 - (annualProductionUnits / annualConsumptionUnits));
  
  // With solar & NEPRA green meter in Pakistan, meter rent + fixed TV fee is ~Rs. 1,800 to Rs. 2,500/month
  const newMonthlyBillPkr = Math.round(2200 + (currentMonthlyBillPkr * remainingFraction));

  // Net monthly savings in PKR
  const netMonthlySavingsPkr = system.financingType === 'bank_islamic_solar'
    ? Math.round(currentMonthlyBillPkr - (newMonthlyBillPkr + monthlyLoanPaymentPkr))
    : Math.round(currentMonthlyBillPkr - newMonthlyBillPkr);

  // Payback period in years (in Pakistan solar pays for itself very fast, often 2.5 to 3.8 years!)
  const annualSavingsPkr = (currentMonthlyBillPkr - newMonthlyBillPkr) * 12;
  const paybackPeriodYears = annualSavingsPkr > 0
    ? Number((netSystemCostPkr / annualSavingsPkr).toFixed(1))
    : 3.5;

  // 25-Year Cumulative Savings in PKR (assuming 8% annual tariff increase in Pakistan)
  let lifetime25YearSavingsPkr = 0;
  let runningUtilityBillPkr = currentMonthlyBillPkr * 12;
  let runningSolarOutput = annualProductionUnits;

  for (let year = 1; year <= 25; year++) {
    const yearGridBillWithoutSolar = runningUtilityBillPkr;
    const yearOffsetRatio = Math.min(1.2, runningSolarOutput / annualConsumptionUnits);
    const yearGridBillWithSolar = (2200 * 12) + (yearGridBillWithoutSolar * Math.max(0, 1 - yearOffsetRatio));

    lifetime25YearSavingsPkr += (yearGridBillWithoutSolar - yearGridBillWithSolar);
    runningUtilityBillPkr *= 1.08; // 8% tariff escalation
    runningSolarOutput *= 0.995; // 0.5% degradation
  }

  lifetime25YearSavingsPkr = Math.round(lifetime25YearSavingsPkr - netSystemCostPkr);

  // Environmental impact
  const carbonOffsetTonsAnnual = Number(((annualProductionUnits * 0.42) / 1000).toFixed(1));
  const treesPlantedEquivalent = Math.round(carbonOffsetTonsAnnual * 18);

  return {
    annualConsumptionUnits,
    annualProductionUnits,
    solarOffsetPercent,
    grossSystemCostPkr,
    nepraNetMeteringFeePkr,
    netSystemCostPkr,
    monthlyLoanPaymentPkr,
    currentMonthlyBillPkr,
    newMonthlyBillPkr,
    netMonthlySavingsPkr,
    paybackPeriodYears,
    lifetime25YearSavingsPkr,
    carbonOffsetTonsAnnual,
    treesPlantedEquivalent,
  };
}

export function generateMonthlyComparison(home: HomeConfig, system: SystemConfig): MonthlyDataPoint[] {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Seasonal solar distribution in Pakistan (peak May-July, lowest Dec-Jan)
  const solarWeights = [0.065, 0.075, 0.090, 0.100, 0.115, 0.120, 0.115, 0.105, 0.095, 0.080, 0.070, 0.060];
  
  // Seasonal electricity consumption in Pakistan (heavy summer AC spike in Jun-Aug, moderate winter)
  const consumptionWeights = [0.060, 0.060, 0.070, 0.085, 0.115, 0.145, 0.155, 0.140, 0.095, 0.075, 0.055, 0.050];

  const { annualProductionUnits, annualConsumptionUnits } = calculateFinancials(home, system);

  return months.map((month, idx) => {
    const prodUnits = Math.round(annualProductionUnits * solarWeights[idx]);
    const consUnits = Math.round(annualConsumptionUnits * consumptionWeights[idx]);

    const billBefore = Math.round(consUnits * home.electricityRateKwh);
    const netUnitsNeeded = Math.max(0, consUnits - prodUnits);
    const surplusUnits = Math.max(0, prodUnits - consUnits);

    // NEPRA Net Metering credit banked at ~85% base tariff
    const greenMeterCredit = surplusUnits * (home.electricityRateKwh * 0.85);
    const billAfter = Math.max(1800, Math.round((netUnitsNeeded * home.electricityRateKwh) - greenMeterCredit + 1800));
    const netSavings = Math.max(0, billBefore - billAfter);

    return {
      month,
      solarProductionUnits: prodUnits,
      homeConsumptionUnits: consUnits,
      billBeforeSolarPkr: billBefore,
      billAfterSolarPkr: billAfter,
      netSavingsPkr: netSavings,
    };
  });
}

// Format numbers into Pakistani numbering format (Lakhs / Millions / Crores)
export function formatPkr(amount: number): string {
  if (amount >= 10000000) {
    return `Rs. ${(amount / 10000000).toFixed(2)} Crore`;
  }
  if (amount >= 100000) {
    return `Rs. ${(amount / 100000).toFixed(2)} Lakh`;
  }
  return `Rs. ${amount.toLocaleString()}`;
}
