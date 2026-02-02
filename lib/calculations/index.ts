import { Assumptions, CalculationResults, YearlyFlow } from '@/types/financial';
import { buildYears, buildCumulativeInflation } from './years';
import { calculateDevelopmentFlows } from './development';
import { buildPhaseServicePayments, buildRevenueSummary } from './revenueSummary';

export function calculateAll(assumptions: Assumptions): CalculationResults {
  const { indexYears, taxYears, collectionYears } = buildYears(
    assumptions.baseTaxYear,
    assumptions.numYears
  );

  const cumulativeInflation = buildCumulativeInflation(
    assumptions.numYears,
    assumptions.munB.minorReappraisalRate || 0.02,
    assumptions.munB.majorReappraisalRate || 0.10
  );

  const apartmentsFlows = calculateDevelopmentFlows(
    assumptions.apartments,
    assumptions.devBase,
    assumptions.munA,
    assumptions.munB,
    indexYears,
    taxYears,
    collectionYears,
    cumulativeInflation,
    true,
    0.5
  );

  const sfHomesFlows = calculateDevelopmentFlows(
    assumptions.sfHomes,
    assumptions.devBase,
    assumptions.munA,
    assumptions.munB,
    indexYears,
    taxYears,
    collectionYears,
    cumulativeInflation,
    false,
    0.5
  );

  const officeFlows = calculateDevelopmentFlows(
    assumptions.office,
    assumptions.devBase,
    assumptions.munA,
    assumptions.munB,
    indexYears,
    taxYears,
    collectionYears,
    cumulativeInflation,
    true,
    0.25
  );

  const condosFlows = calculateDevelopmentFlows(
    assumptions.condos,
    assumptions.devBase,
    assumptions.munA,
    assumptions.munB,
    indexYears,
    taxYears,
    collectionYears,
    cumulativeInflation,
    false,
    0.5
  );

  const flowsByBlock: Record<string, YearlyFlow[]> = {
    'Phase 1': apartmentsFlows,
    'Phase 2': sfHomesFlows,
    'Phase 3': officeFlows,
    'Phase 4': condosFlows,
  };

  const phaseMSPs = buildPhaseServicePayments(flowsByBlock);

  const { rows: revenueSummary, bondSummary } = buildRevenueSummary(
    indexYears,
    taxYears,
    collectionYears,
    phaseMSPs,
    assumptions.bond
  );

  return {
    indexYears,
    taxYears,
    collectionYears,
    apartmentsFlows,
    sfHomesFlows,
    officeFlows,
    condosFlows,
    phaseMSPs,
    revenueSummary,
    bondSummary,
  };
}
