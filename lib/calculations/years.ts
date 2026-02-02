export function buildYears(baseTaxYear: number, numYears: number): {
  indexYears: number[];
  taxYears: number[];
  collectionYears: number[];
} {
  const indexYears: number[] = [];
  const taxYears: number[] = [];
  const collectionYears: number[] = [];

  for (let i = 0; i < numYears; i++) {
    indexYears.push(i + 1);
    taxYears.push(baseTaxYear + i);
    collectionYears.push(baseTaxYear + i + 1);
  }

  return { indexYears, taxYears, collectionYears };
}

export function buildCumulativeInflation(
  numYears: number,
  minorReappraisalRate: number = 0,
  majorReappraisalRate: number = 0,
): number[] {
  const cumulativeInflation: number[] = [];
  let cumulative = 0;

  for (let i = 0; i < numYears; i++) {
    cumulativeInflation.push(cumulative);
    const yearIndex = i + 1;
    if (yearIndex % 6 === 0) {
      cumulative += majorReappraisalRate;
    } else {
      cumulative += minorReappraisalRate;
    }
  }

  return cumulativeInflation;
}
