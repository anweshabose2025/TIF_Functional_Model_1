import {
  DevelopmentAssumptions,
  DevelopmentBaseValue,
  MunicipalityAssumptions,
  YearlyFlow,
  AbatementStructure,
} from '@/types/financial';

const ASSESSMENT_RATIO = 0.35;

export function calculateDevelopmentFlows(
  dev: DevelopmentAssumptions,
  devBase: DevelopmentBaseValue,
  munA: MunicipalityAssumptions,
  munB: MunicipalityAssumptions,
  indexYears: number[],
  taxYears: number[],
  collectionYears: number[],
  cumulativeInflation: number[],
  isCommercial: boolean = true,
  phaseConstructionFactor: number = 0.5,
): YearlyFlow[] {
  const flows: YearlyFlow[] = [];

    const baseLandValue = dev.acreage * devBase.basePerAcre;
    const totalInitialValue = dev.unitsOrSF * dev.valuePerUnit;
    const initialImprovementValue = Math.max(totalInitialValue - baseLandValue, 0);

    const prelimImpvmtValue = (dev.unitsOrSF * dev.valuePerUnit) - baseLandValue;


    const abatementStructure = munA.abatementByUse[dev.name] || getDefaultAbatement();
      const abatementStructureLandGrowth = munA.abatementByUse["Land Growth"] || getDefaultAbatement();
    const taxRates = munA.taxRates;

      const landGrowthValue = (prelimImpvmtValue * (abatementStructure.landGrowthFactor ||1));

    //***************************************************** */
    const unitsOrSF = dev.unitsOrSF;
    const valuePerUnit = dev.valuePerUnit;
    const devName = dev.name;
    const landGwthFac = abatementStructure.landGrowthFactor;
    //******************************************************** */

    const round2 = (v: number) => Math.round(v * 100) / 100;
    let inflationFactor = 0;
    //let cumulativeInflation = 0;
    let cumfactor = 0.03;
    let cumulativeInflationFactor=0;
    let previousInflationFactorValue = 0;
    let previousImprovementValue = 0;
    let prevLandGrowth = 0;
    let previousBuildingAbatementYear  = 0;
    let landAbatementYear = 0;
//for (let i = 0; i < flows.length; i++) {
    for (let i = 0; i < indexYears.length; i++) {
        const indexYear = indexYears[i];
        const taxYear = taxYears[i];
        const collectionYear = collectionYears[i];
        const yearsSinceCompletion = taxYear - dev.completionYear;
        if(i===0)
        {
          landAbatementYear = abatementStructureLandGrowth.termYears - abatementStructureLandGrowth.termYears +1;
        }
        else if(i>0 && i<abatementStructureLandGrowth.termYears)
        {
          landAbatementYear = abatementStructureLandGrowth.termYears - abatementStructureLandGrowth.termYears +i+1;
        }
        else
        {
          landAbatementYear=0;
        }
        const buildingAbatementYear = dev.completionYear >= collectionYear ? 0 : dev.completionYear + 1 === collectionYear
        ? 1 : dev.completionYear + 15 >= collectionYear ? previousBuildingAbatementYear + 1 : 0;
        previousBuildingAbatementYear = buildingAbatementYear;

        const isActive = yearsSinceCompletion >= 0;
        let baseValue = baseLandValue;
        let landGrowth = 0;//taxYear;//0;
        let improvementValue = dev.completionYear;//0;

        const cyclePosition = (indexYear - 1) % 6;
        inflationFactor = cyclePosition < 3 ? Number(munB.minorReappraisalRate) : Number(munB.majorReappraisalRate);

        const isNewBlock = (indexYear - 1) % 3 === 0;

        if (indexYear === 1) {
          cumfactor = Number(Number(munB.minorReappraisalRate ?? 0));
          cumulativeInflationFactor = round2(Number(munB.minorReappraisalRate || '0'));
          //cumulativeInflationFactor = Number(munB.minorReappraisalRate ?? 0);
        }
        else if (isNewBlock) {
          cumfactor =Number((1 + cumulativeInflationFactor) * (1 + inflationFactor) - 1);
          cumulativeInflationFactor = round2((1 + cumulativeInflationFactor) * (1 + inflationFactor) - 1);
          //cumulativeInflationFactor = (1 + cumulativeInflationFactor) * (1 + inflationFactor) - 1;
        }
        if (yearsSinceCompletion < 0) {
          landGrowth = 0;
          improvementValue = 0;
        }
        else if (yearsSinceCompletion === 0) {
          // First active year – initialize
          landGrowth = landGrowthValue * (1 + cumfactor);
          improvementValue = (prelimImpvmtValue - landGrowthValue) * (1 + cumfactor);
          prevLandGrowth = landGrowth;
          previousInflationFactorValue = inflationFactor;
          previousImprovementValue = improvementValue;
        }
        else {
          if (previousInflationFactorValue !== inflationFactor) {
            // Inflation rate changed → compound once
            landGrowth =
            prevLandGrowth * (1 + inflationFactor);
            improvementValue = previousImprovementValue * (1 + inflationFactor)
          } 
          else {
            // Same inflation → carry forward
            landGrowth = prevLandGrowth;
            improvementValue = previousImprovementValue;
          }
          prevLandGrowth = landGrowth;
          previousInflationFactorValue = inflationFactor;
          previousImprovementValue = improvementValue;
        }


        // console.log({
        // indexYear,
        // unitsOrSF, 
        // valuePerUnit, 
        // devName,
        // landGwthFac,
        // landGrowthValue,
        // yearsSinceCompletion,
        // baseLandValue,
        // prelimImpvmtValue,
        // inflationFactor,
        // cumulativeInflationFactor,
        // cumfactor,
        // landGrowth,
        // previousInflationFactorValue,
        // prevLandGrowth
        // });
        // }

        //console.log(prevLandGrowth);
        const fullValue = baseValue + landGrowth + improvementValue;
        const assessedValue = fullValue * ASSESSMENT_RATIO;
        const isInAbatementPeriod = isActive && yearsSinceCompletion < abatementStructure.termYears;
        let fullTax = 0;
        let taxToSchool = 0;
        let taxToNonSchool = 0;
        let tifCollection = 0;
        let cdcLand = 0;
        let cdcImprovement = 0;
        let constructionServicePayments = 0;
        let abatedValueRetained = 0;

      //if (isActive) {
        const schoolRate = isCommercial ? taxRates.schoolCommercialRate : taxRates.schoolResidentialRate;
        const nonSchoolRate = isCommercial ? taxRates.nonSchoolCommercialRate : taxRates.nonSchoolResidentialRate;

        fullTax = assessedValue * (schoolRate + nonSchoolRate);
        //console.log("aaaaaa");
        //console.log(isCommercial,schoolRate , nonSchoolRate , (schoolRate + nonSchoolRate));

        // if (isInAbatementPeriod) {
        //   const abatedPortion = abatementStructure.abatementFraction;
        //   const nonAbatedPortion = abatementStructure.nonAbatedFraction;
        //   const cdcPortion = abatementStructure.cdcFraction;
        //   const retainedPortion = abatementStructure.retainedFraction;

        //   const schoolTaxFull = assessedValue * schoolRate;
        //   const nonSchoolTaxFull = assessedValue * nonSchoolRate;

        //   taxToSchool = schoolTaxFull * nonAbatedPortion;

        //   const abatedNonSchoolTax = nonSchoolTaxFull * abatedPortion;
        //   tifCollection = abatedNonSchoolTax * (1 - cdcPortion);

        //   const landGrowthAssessed = landGrowth * ASSESSMENT_RATIO;
        //   const improvementAssessed = improvementValue * ASSESSMENT_RATIO;

        //   cdcLand = landGrowthAssessed * nonSchoolRate * cdcPortion;
        //   cdcImprovement = improvementAssessed * nonSchoolRate * cdcPortion;

        //   taxToNonSchool = nonSchoolTaxFull * nonAbatedPortion;

        //   constructionServicePayments = (tifCollection + cdcLand + cdcImprovement) * phaseConstructionFactor;

        //   abatedValueRetained = abatedNonSchoolTax * retainedPortion;
        // } else {
        //   taxToSchool = 1; //assessedValue * schoolRate;
        //   taxToNonSchool = 2;//assessedValue * nonSchoolRate;
        // }
      //}

        if (landAbatementYear === 0 && buildingAbatementYear === 0) {
          taxToSchool = (baseValue*0.35*schoolRate)+(landGrowth*0.35*schoolRate)+(improvementValue*0.35*schoolRate)
          //(baseValue + landGrowth + improvementValue) * 0.35 * schoolRate;
        }
        else if (landAbatementYear === 0 && buildingAbatementYear > 0) {
          taxToSchool =(baseValue*0.35*schoolRate)+(landGrowth*0.35*schoolRate)+(improvementValue*abatementStructure.nonAbatedFraction *0.35*schoolRate)
            //(baseValue + landGrowth + improvementValue * abatementStructure.nonAbatedFraction)  * 0.35 * schoolRate;
        }
        else if (landAbatementYear > 0 && buildingAbatementYear === 0) {
          //taxToSchool = (baseValue + landGrowth * abatementStructure.nonAbatedFraction + improvementValue) * 0.35 * schoolRate; //Land_Growth_Non_abated
          taxToSchool = (baseValue*0.35*schoolRate)+(landGrowth*abatementStructure.nonAbatedFraction*0.35*schoolRate)+(improvementValue*0.35*schoolRate)
        }
        else if (landAbatementYear > 0 && buildingAbatementYear > 0) {
          // taxToSchool =
          //   (baseValue + landGrowth * abatementStructure.nonAbatedFraction + improvementValue * abatementStructure.nonAbatedFraction)
          //   * 0.35 * schoolRate; //Land_Growth_Non_abated
          taxToSchool =(baseValue*0.35*schoolRate)+
                      (landGrowth*abatementStructureLandGrowth.nonAbatedFraction*0.35*schoolRate)+
                      (improvementValue*abatementStructure.nonAbatedFraction*0.35*schoolRate)
        }
        taxToNonSchool=(baseValue*0.35*nonSchoolRate);

      if (landAbatementYear === 0 && buildingAbatementYear === 0) {
        //taxToSchool = (baseValue*0.35*schoolRate)+(landGrowth*0.35*schoolRate)+(improvementValue*0.35*schoolRate)
        tifCollection = (landGrowth*0.35*nonSchoolRate)+(improvementValue*0.35*nonSchoolRate);
      }
      else if (landAbatementYear === 0 && buildingAbatementYear > 0) {
        //taxToSchool =(baseValue*0.35*schoolRate)+(landGrowth*0.35*schoolRate)+(improvementValue*abatementStructure.nonAbatedFraction *0.35*schoolRate)
        tifCollection = (landGrowth*0.35*nonSchoolRate)+(improvementValue*abatementStructure.nonAbatedFraction*0.35*nonSchoolRate);
      }
      else if (landAbatementYear > 0 && buildingAbatementYear === 0) {
        //taxToSchool = (baseValue*0.35*schoolRate)+(landGrowth*abatementStructure.nonAbatedFraction*0.35*schoolRate)+(improvementValue*0.35*schoolRate)
        tifCollection = (landGrowth*abatementStructureLandGrowth.nonAbatedFraction*0.35*nonSchoolRate)+(improvementValue*abatementStructure.nonAbatedFraction*0.35*nonSchoolRate);
      }
      else if (landAbatementYear > 0 && buildingAbatementYear > 0) {
        //taxToSchool =(baseValue*0.35*schoolRate)+
        //            (landGrowth*abatementStructureLandGrowth.nonAbatedFraction*0.35*schoolRate)+
        //            (improvementValue*abatementStructure.nonAbatedFraction*0.35*schoolRate)
        tifCollection = (landGrowth*abatementStructureLandGrowth.nonAbatedFraction*0.35*nonSchoolRate)+(improvementValue*abatementStructure.nonAbatedFraction*0.35*nonSchoolRate);
      }


        console.log({
        indexYear,
        landAbatementYear, 
        buildingAbatementYear, 
        devName
        });
        

      cdcLand = landAbatementYear>0 ? landGrowth*0.35*abatementStructureLandGrowth.cdcFraction*Number(schoolRate+nonSchoolRate) :0;
      cdcImprovement = buildingAbatementYear>0 ? improvementValue*0.35*abatementStructure.cdcFraction*Number(schoolRate+nonSchoolRate):0;
      
      constructionServicePayments = 0
      


if (landAbatementYear === 0) {
  if (buildingAbatementYear === 0) {
    abatedValueRetained = 0;
  } else {
    abatedValueRetained = improvementValue * abatementStructure.retainedFraction * 0.35 * Number(schoolRate+nonSchoolRate);
  }
} else {
  abatedValueRetained =
    landGrowth * abatementStructureLandGrowth.retainedFraction * 0.35 * Number(schoolRate+nonSchoolRate) +
    (buildingAbatementYear === 0 ? 0 : improvementValue * abatementStructure.retainedFraction * 0.35 * Number(schoolRate+nonSchoolRate));
}







const totalAnnualCollections = taxToSchool + taxToNonSchool + tifCollection + cdcLand + cdcImprovement + constructionServicePayments;
    const minimumServicePayments = tifCollection + cdcLand + cdcImprovement + constructionServicePayments;

    const taxValueTest = totalAnnualCollections + abatedValueRetained - fullTax;

    flows.push({
      indexYear,
      taxYear,
      collectionYear,
      landAbatementYear,
      buildingAbatementYear,
      inflationFactor,
      cumulativeInflationFactor,
      baseValue,
      landGrowth,
      improvementValue,
      fullValue,
      fullTax,
      taxToSchool,
      taxToNonSchool,
      tifCollection,
      cdcLand,
      cdcImprovement,
      constructionServicePayments,
      abatedValueRetained,
      totalAnnualCollections,
      minimumServicePayments,
      taxValueTest,
    });
  }

/////
const allowCSP = devName === "Apartments" || devName === "Office";
  if (allowCSP) {
    for (let i = flows.length - 1; i >= 0; i--) {
    const currentSum =
      flows[i].tifCollection +
      flows[i].cdcLand +
      flows[i].cdcImprovement;

    const nextSum =
      flows[i + 1]
        ? flows[i + 1].tifCollection +
          flows[i + 1].cdcLand +
          flows[i + 1].cdcImprovement
        : 0;

    const nextNextSum =
      flows[i + 2]
        ? flows[i + 2].tifCollection +
          flows[i + 2].cdcLand +
          flows[i + 2].cdcImprovement
        : 0;

    const nextCSP = flows[i + 1]?.constructionServicePayments ?? 0;

    if (currentSum === 0) {
      if (nextCSP === 0) {
        flows[i].constructionServicePayments = nextSum * 0.5;
      } else {
        flows[i].constructionServicePayments = nextNextSum * 0.25;
      }
    } else {
      flows[i].constructionServicePayments = 0;
    }
}
}

for (let i = 0; i < flows.length; i++) {
  flows[i].totalAnnualCollections =
    flows[i].taxToSchool +
    flows[i].taxToNonSchool +
    flows[i].tifCollection +
    flows[i].cdcLand +
    flows[i].cdcImprovement +
    flows[i].constructionServicePayments;
}
//////

  return flows;
}

function getDefaultAbatement(): AbatementStructure {
  return {
    termYears: 15,
    abatementFraction: 1,
    nonAbatedFraction: 0,
    cdcFraction: 0.5,
    retainedFraction: 0.5,
    landGrowthFactor: 0.12,
  };
}
