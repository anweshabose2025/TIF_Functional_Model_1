export interface DevelopmentAssumptions {
  name: string;
  completionYear: number;
  acreage: number;
  unitsOrSF: number;
  valuePerUnit: number;
}

export interface DevelopmentBaseValue {
  totalAcres: number;
  baseValue: number;
  basePerAcre: number;
}

export interface BondAssumptions {
  discountRateNPV: number;
  capitalizedInterestRate: number;
  issuanceCostRate: number;
  reserveRate: number;
  debtCoverageRatioTarget: number;
}

export interface MunicipalityTaxRates {
  schoolResidentialRate: number;
  schoolCommercialRate: number;
  nonSchoolResidentialRate: number;
  nonSchoolCommercialRate: number;
}

export interface AbatementStructure {
  termYears: number;
  abatementFraction: number;
  nonAbatedFraction: number;
  cdcFraction: number;
  retainedFraction: number;
  baseValue?: number;
  landGrowthFactor?: number;
}

export interface MunicipalityAssumptions {
  taxRates: MunicipalityTaxRates;
  abatementByUse: Record<string, AbatementStructure>;
  minorReappraisalRate?: number;
  majorReappraisalRate?: number;
  totalAcres?: number;
}

export interface YearlyFlow {
  indexYear: number;
  taxYear: number;
  buildingAbatementYear:number;
  landAbatementYear:number;
  collectionYear: number;
  inflationFactor: number;
  cumulativeInflationFactor:number;
  baseValue: number;
  landGrowth: number;
  improvementValue: number;
  fullValue: number;
  fullTax: number;
  taxToSchool: number;
  taxToNonSchool: number;
  tifCollection: number;
  cdcLand: number;
  cdcImprovement: number;
  constructionServicePayments: number;
  abatedValueRetained: number;
  totalAnnualCollections: number;
  minimumServicePayments: number;
  taxValueTest: number;
}

export interface PhaseServicePayments {
  phaseName: string;
  mspByYear: number[];
  cspByYear: number[];//
}

export interface RevenueSummaryRow {
  indexYear: number;
  taxYear: number;
  collectionYear: number;
  mspPhase1: number;
  mspPhase2: number;
  mspPhase3: number;
  mspPhase4: number;
  totalMsp: number;
  cashFlow: number;
  remaining: number;
  aBondCashFlow: number;
  excessFromA: number;
}

export interface BondSummary {
  npvBondCashFlow: number;
  npvExcessFromA: number;
  issuanceCost: number;
  capitalizedInterest: number;
  reserveContribution: number;
  grossBondSale: number;
  netRevenueToNCA: number;
  surplus: number;
}

export interface Assumptions {
  devBase: DevelopmentBaseValue;
  apartments: DevelopmentAssumptions;
  sfHomes: DevelopmentAssumptions;
  office: DevelopmentAssumptions;
  condos: DevelopmentAssumptions;
  bond: BondAssumptions;
  munA: MunicipalityAssumptions;
  munB: MunicipalityAssumptions;
  baseTaxYear: number;
  numYears: number;
}

export interface CalculationResults {
  indexYears: number[];
  taxYears: number[];
  collectionYears: number[];
  apartmentsFlows: YearlyFlow[];
  sfHomesFlows: YearlyFlow[];
  officeFlows: YearlyFlow[];
  condosFlows: YearlyFlow[];
  phaseMSPs: PhaseServicePayments[];
  revenueSummary: RevenueSummaryRow[];
  bondSummary: BondSummary;
}
