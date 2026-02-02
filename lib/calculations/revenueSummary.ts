import {
  YearlyFlow,
  PhaseServicePayments,
  RevenueSummaryRow,
  BondSummary,
  BondAssumptions,
} from '@/types/financial';

export function npv(rate: number, cashFlows: number[]): number {
  return cashFlows.reduce((acc, cf, i) => acc + cf / Math.pow(1 + rate, i + 1), 0);
}

export function buildPhaseServicePayments(
  flowsByBlock: Record<string, YearlyFlow[]>
): PhaseServicePayments[] {
  const phases: PhaseServicePayments[] = [];
  const phaseKeys = ['Phase 1', 'Phase 2', 'Phase 3', 'Phase 4'];

  for (const phaseName of phaseKeys) {
    const flows = flowsByBlock[phaseName] || [];
    const mspByYear = flows.map(f => f.minimumServicePayments);
    const cspByYear = flows.map(f => f.constructionServicePayments);//
    phases.push({ phaseName, mspByYear, cspByYear });
  }

  return phases;
}

export function buildRevenueSummary(
  indexYears: number[],
  taxYears: number[],
  collectionYears: number[],
  phaseMSPs: PhaseServicePayments[],
  bond: BondAssumptions,
): {
  rows: RevenueSummaryRow[];
  bondSummary: BondSummary;
} {
  const rows: RevenueSummaryRow[] = [];

  const aBondCashFlows: number[] = [];
  const excessFromAFlows: number[] = [];

  for (let i = 0; i < indexYears.length; i++) {
    const mspPhase1 = phaseMSPs[0]?.mspByYear[i] || 0;
    const mspPhase2 = phaseMSPs[1]?.mspByYear[i] || 0;
    const mspPhase3 = phaseMSPs[2]?.mspByYear[i] || 0;
    const mspPhase4 = phaseMSPs[3]?.mspByYear[i] || 0;
    const cspPhase1 = phaseMSPs[0]?.cspByYear[i] || 0;
    const cspPhase2 = phaseMSPs[1]?.cspByYear[i] || 0;
    const cspPhase3 = phaseMSPs[2]?.cspByYear[i] || 0;
    const cspPhase4 = phaseMSPs[3]?.cspByYear[i] || 0;

    const totalMsp = mspPhase1 + mspPhase2 + mspPhase3 + mspPhase4;
    const totalCsp = cspPhase1 + cspPhase2 + cspPhase3 + cspPhase4;
    const cashFlow = (totalMsp +totalCsp) / bond.debtCoverageRatioTarget;
    const remaining = (totalMsp + totalCsp) - cashFlow;

    const aBondCashFlow = cashFlow;
    const excessFromA = remaining;

    aBondCashFlows.push(aBondCashFlow);
    excessFromAFlows.push(excessFromA);

    rows.push({
      indexYear: indexYears[i],
      taxYear: taxYears[i],
      collectionYear: collectionYears[i],
      mspPhase1:mspPhase1 + cspPhase1,
      mspPhase2 :mspPhase2 + cspPhase2,
      mspPhase3:mspPhase3 + cspPhase3,
      mspPhase4:mspPhase4 + cspPhase4,
      totalMsp: totalMsp + totalCsp,
      cashFlow,
      remaining,
      aBondCashFlow,
      excessFromA,
    });
  }

  const npvBondCashFlow = npv(bond.discountRateNPV, aBondCashFlows);
  const npvExcessFromA = npv(bond.discountRateNPV, excessFromAFlows);

  const issuanceCost = npvBondCashFlow * bond.issuanceCostRate;
  const capitalizedInterest = npvBondCashFlow * bond.capitalizedInterestRate;
  const reserveContribution = npvBondCashFlow * bond.reserveRate;
  const grossBondSale = npvBondCashFlow;
  const netRevenueToNCA = grossBondSale - issuanceCost - capitalizedInterest - reserveContribution;
  const surplus = npvExcessFromA;

  const bondSummary: BondSummary = {
    npvBondCashFlow,
    npvExcessFromA,
    issuanceCost,
    capitalizedInterest,
    reserveContribution,
    grossBondSale,
    netRevenueToNCA,
    surplus,
  };

  return { rows, bondSummary };
}
