export type RoofType = 'concrete_rcc_slab' | 'corrugated_gi_shed' | 'tile_slanted' | 'terrace_pergola' | 'elevated_structure';

export type SunExposure = 'full_unshaded' | 'partial_parapet_shade' | 'dense_urban_shade';

export type PanelTier = 'longi_himo7' | 'jinko_tiger_neo' | 'canadian_solar_topcon';

export type InverterTier = 'inverex_nitrox' | 'knox_krypton' | 'growatt_sph';

export type BatteryPack =
  | 'none'
  | 'itel_lifepo4_5kwh'
  | 'crown_lifepo4_10kwh'
  | 'crown_tubular_lead'
  | 'narada_pylontech_15kwh';

export type FlowMode = 'sunny_export' | 'evening_battery' | 'cloudy_grid' | 'grid_outage' | 'manual';

export type DiscoProvider =
  | 'LESCO'
  | 'KElectric'
  | 'IESCO'
  | 'MEPCO'
  | 'FESCO'
  | 'GEPCO'
  | 'PESCO'
  | 'HESCO'
  | 'SEPCO'
  | 'QESCO';

export const DISCO_INFO: Record<DiscoProvider, { name: string; region: string; fullName: string }> = {
  LESCO: { name: 'LESCO', region: 'Lahore & Kasur', fullName: 'Lahore Electric Supply Company' },
  KElectric: { name: 'K-Electric', region: 'Karachi Hub', fullName: 'K-Electric Karachi' },
  IESCO: { name: 'IESCO', region: 'Islamabad & Rawalpindi', fullName: 'Islamabad Electric Supply Company' },
  MEPCO: { name: 'MEPCO', region: 'Multan & South Punjab', fullName: 'Multan Electric Power Company' },
  FESCO: { name: 'FESCO', region: 'Faisalabad', fullName: 'Faisalabad Electric Supply Company' },
  GEPCO: { name: 'GEPCO', region: 'Gujranwala & Sialkot', fullName: 'Gujranwala Electric Power Company' },
  HESCO: { name: 'HESCO', region: 'Hyderabad & Sindh', fullName: 'Hyderabad Electric Supply Company' },
  SEPCO: { name: 'SEPCO', region: 'Sukkur & Upper Sindh', fullName: 'Sukkur Electric Power Company' },
  PESCO: { name: 'PESCO', region: 'Peshawar & KP', fullName: 'Peshawar Electric Supply Company' },
  QESCO: { name: 'QESCO', region: 'Quetta & Balochistan', fullName: 'Quetta Electric Supply Company' },
};

export type HomePlotSize = '5_marla' | '10_marla' | '1_kanal' | '2_kanal' | 'commercial';

export interface HomeConfig {
  homeSizeSqFt: number; // e.g. 2,250 sq.ft (10 Marla)
  plotSize: HomePlotSize;
  monthlyBill: number; // PKR, e.g. Rs. 85,000/mo
  electricityRateKwh: number; // PKR per unit, e.g. Rs. 65/unit (including fuel price adjustment and peak charges)
  disco: DiscoProvider;
  roofType: RoofType;
  sunExposure: SunExposure;
  city: string; // Lahore, Karachi, Islamabad, etc.
}

export interface SystemConfig {
  solarCapacityKw: number; // e.g. 10 kW, 15 kW
  panelTier: PanelTier;
  inverterTier: InverterTier;
  batteryPack: BatteryPack;
  financingType: 'cash' | 'bank_islamic_solar';
  loanTermYears: number; // 3 or 5 years (Meezan / Bank Alfalah Solar financing)
  loanApr: number; // KIBOR + 3% (~18%) or subsidized green scheme
}

export interface FinancialBreakdown {
  annualConsumptionUnits: number; // units (kWh)
  annualProductionUnits: number; // units (kWh)
  solarOffsetPercent: number;
  grossSystemCostPkr: number; // Rs.
  nepraNetMeteringFeePkr: number; // Rs.
  netSystemCostPkr: number; // Rs.
  monthlyLoanPaymentPkr: number; // Rs.
  currentMonthlyBillPkr: number; // Rs.
  newMonthlyBillPkr: number; // Rs. (near 0 or minimal meter rent)
  netMonthlySavingsPkr: number; // Rs.
  paybackPeriodYears: number;
  lifetime25YearSavingsPkr: number; // Rs. in Lakhs / Crores
  carbonOffsetTonsAnnual: number;
  treesPlantedEquivalent: number;
}

export interface MonthlyDataPoint {
  month: string;
  solarProductionUnits: number;
  homeConsumptionUnits: number;
  billBeforeSolarPkr: number;
  billAfterSolarPkr: number;
  netSavingsPkr: number;
}

export interface InstallationStage {
  id: number;
  title: string;
  subtitle: string;
  status: 'completed' | 'in_progress' | 'scheduled' | 'pending';
  estimatedDate: string;
  completionPercentage: number;
  details: string;
}

export interface ProposalInfo {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  propertyAddress: string;
  city: string;
  discoConsumerNumber: string;
  notes: string;
}
