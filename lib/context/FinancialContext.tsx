'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';//
import { Assumptions, CalculationResults } from '@/types/financial';
import { calculateAll } from '@/lib/calculations';

interface FinancialContextType {
  assumptions: Assumptions;
  results: CalculationResults | null;
  updateAssumptions: (newAssumptions: Assumptions) => void;
  recalculate: () => void;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

const defaultAssumptions: Assumptions = {
  devBase: {
    totalAcres: 80,
    baseValue: 6_700_000,
    basePerAcre: 83_750,
  },
  apartments: {
    name: 'Apartments',
    completionYear: 2022,
    acreage: 10.38,
    unitsOrSF: 293,
    valuePerUnit: 132000,
  },
  sfHomes: {
    name: 'Single-Family Homes',
    completionYear: 2023,
    acreage: 4.28,
    unitsOrSF: 12,
    valuePerUnit: 750_000,
  },
  office: {
    name: 'Office',
    completionYear: 2022,
    acreage: 1.67,
    unitsOrSF: 43_000,
    valuePerUnit: 160,
  },
  condos: {
    name: 'Condos',
    completionYear: 2023,
    acreage: 1.05857142857143,
    unitsOrSF: 31,
    valuePerUnit: 550_000,
  },
  bond: {
    discountRateNPV: .0325,
    capitalizedInterestRate: 0.05,
    issuanceCostRate: 0.04,
    reserveRate: 0.10,
    debtCoverageRatioTarget: 1.1,
  },
  munA: {
    totalAcres: 80,
    taxRates: {
      schoolResidentialRate: 0.057772736,
      schoolCommercialRate: 0.066633322,
      nonSchoolResidentialRate: 0.022720332,
      nonSchoolCommercialRate:  0.023702183 
,
    },
    abatementByUse: {
      'Land Growth': {
        termYears: 10,
        abatementFraction: 1,
        nonAbatedFraction: 0,
        cdcFraction: 0.5,
        retainedFraction: 0.5,
        landGrowthFactor: .12,
      },
      'Apartments': {
        termYears: 15,
        abatementFraction: 1,
        nonAbatedFraction: 0,
        cdcFraction: 0.5,
        retainedFraction: 0.5,
        landGrowthFactor: .12,
      },
      'For Sale Residential': {
        termYears: 15,
        abatementFraction: 1,
        nonAbatedFraction: 0,
        cdcFraction: 0.5,
        retainedFraction: 0.5,
        landGrowthFactor: .12,
      },
      'Office': {
        termYears: 10,
        abatementFraction: 0.75,
        nonAbatedFraction: 0.25,
        cdcFraction: 0.25,
        retainedFraction: 0.5,
        landGrowthFactor: .12,
      },
      'Retail': {
        termYears: 0,//10
        abatementFraction: 0,
        nonAbatedFraction: 1,
        cdcFraction: 0,
        retainedFraction: 0,
        landGrowthFactor: .12,
      },
      'Senior Apartments': {
        termYears: 15,
        abatementFraction: 1,
        nonAbatedFraction: 0,
        cdcFraction: 0.5,
        retainedFraction: 0.5,
        landGrowthFactor: .12,
      },
      'Hotel': {
        termYears: 0,//12,
        abatementFraction: 0,
        nonAbatedFraction: 1,
        cdcFraction: 0,
        retainedFraction: 0,
        landGrowthFactor: .12,
      },
    },
  },
  munB: {
    minorReappraisalRate: 0.03,
    majorReappraisalRate: 0.06,
    taxRates: {
      schoolResidentialRate: 0.014,
      schoolCommercialRate: 0.018,
      nonSchoolResidentialRate: 0.009,
      nonSchoolCommercialRate: 0.011,
    },
    abatementByUse: {
      'Land Growth': {
        termYears: 10,
        abatementFraction: 1,//0.70,
        nonAbatedFraction: 0,//0.30,
        cdcFraction: 0.5,//0.12,
        retainedFraction: 0.5,//0.08,
        landGrowthFactor: .12,
      },
      'Apartments': {
        termYears: 15,
        abatementFraction: 1,//0.70,
        nonAbatedFraction: 0,//0.30,
        cdcFraction: 0.5,//0.12,
        retainedFraction: 0.5,//0.08,
        landGrowthFactor: .12,
      },
      'For Sale Residential': {
        termYears: 15,//10,
        abatementFraction: 1,//0.65,
        nonAbatedFraction: 0,//0.35,
        cdcFraction: 0.5,
        retainedFraction: 0.5,
        landGrowthFactor: .12,
      },
      'Office': {
        termYears: 10,//15,
        abatementFraction: 0.75,
        nonAbatedFraction: 0.25,
        cdcFraction: 0.25,
        retainedFraction: 0.5,
        landGrowthFactor: .12,
      },
      'Retail': {
        termYears: 0,//10,
        abatementFraction: 0,
        nonAbatedFraction: 1,
        cdcFraction: 0,
        retainedFraction: 0,
        landGrowthFactor: .12,
      },
      'Senior Apartments': {
        termYears: 15,
        abatementFraction: 1,
        nonAbatedFraction: 0,
        cdcFraction: 0.5,
        retainedFraction: 0.5,
        landGrowthFactor: .12,
      },
      'Hotel': {
        termYears: 0,//12,
        abatementFraction: 0,
        nonAbatedFraction: 1,
        cdcFraction: 0,
        retainedFraction: 0,
        landGrowthFactor: .12,
      },
    },
  },
  baseTaxYear: 2020,
  numYears: 30,
};

export function FinancialProvider({ children }: { children: ReactNode }) {
  const [assumptions, setAssumptions] = useState<Assumptions>(defaultAssumptions);
//  const [assumptions, setAssumptions] = useState<Assumptions>(() => {
//  if (typeof window !== "undefined") {
//    const saved = localStorage.getItem("assumptions");
//    if (saved) return JSON.parse(saved);
//  }
//  return defaultAssumptions;
//});
//useEffect(() => {
//  localStorage.setItem("assumptions", JSON.stringify(assumptions));
//}, [assumptions]);

//

  const [results, setResults] = useState<CalculationResults | null>(null);


  const updateAssumptions = (newAssumptions: Assumptions) => {
    setAssumptions(newAssumptions);
  };

  const recalculate = () => {
    try {
      const calculatedResults = calculateAll(assumptions);
      setResults(calculatedResults);
    } catch (error) {
      console.error('Calculation error:', error);
    }
  };

  return (
    <FinancialContext.Provider value={{ assumptions, results, updateAssumptions, recalculate}}>
      {children}
    </FinancialContext.Provider>
  );
}

export function useFinancial() {
  const context = useContext(FinancialContext);
  if (context === undefined) {
    throw new Error('useFinancial must be used within a FinancialProvider');
  }
  return context;
}
