'use client';

import { useFinancial } from '@/lib/context/FinancialContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import InputField from '@/components/InputField';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Assumptions } from '@/types/financial';
import { useState, useEffect } from 'react';

export default function AssumptionsPage() {
  const { assumptions, updateAssumptions, recalculate, results, saveAssumptions, isLoading } = useFinancial();
  const [localAssumptions, setLocalAssumptions] = useState<Assumptions>(assumptions);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);


  useEffect(() => {
  const calc = (use: any) => {
    const nonAbatedFraction = Number((1 - use.abatementFraction).toFixed(2));
    const retainedFraction = Number(Math.max(0,use.abatementFraction - use.cdcFraction)).toFixed(1);

    return {
      ...use,
      nonAbatedFraction,
      retainedFraction,
    };
  };

  const updatedAssumptions = {
    ...localAssumptions,
    devBase: {
      ...localAssumptions.devBase,
      basePerAcre:
        localAssumptions.devBase.baseValue /
        localAssumptions.devBase.totalAcres,
    },
    munA: {
      ...localAssumptions.munA,
      abatementByUse: {
        ...localAssumptions.munA.abatementByUse,
        "Land Growth": calc(localAssumptions.munA.abatementByUse["Land Growth"]),
        Apartments: calc(localAssumptions.munA.abatementByUse["Apartments"]),
        "For Sale Residential": calc(
          localAssumptions.munA.abatementByUse["For Sale Residential"]
        ),
        Office: calc(localAssumptions.munA.abatementByUse["Office"]),
        Retail: calc(localAssumptions.munA.abatementByUse["Retail"]),
        "Senior Apartments": calc(
          localAssumptions.munA.abatementByUse["Senior Apartments"]
        ),
        Hotel: calc(localAssumptions.munA.abatementByUse["Hotel"]),
      },
    },
    munB: {
      ...localAssumptions.munB,
      abatementByUse: {
        ...localAssumptions.munB.abatementByUse,
        "Land Growth": calc(localAssumptions.munB.abatementByUse["Land Growth"]),
        Apartments: calc(localAssumptions.munB.abatementByUse["Apartments"]),
        "For Sale Residential": calc(
          localAssumptions.munB.abatementByUse["For Sale Residential"]
        ),
        Office: calc(localAssumptions.munB.abatementByUse["Office"]),
        Retail: calc(localAssumptions.munB.abatementByUse["Retail"]),
        "Senior Apartments": calc(
          localAssumptions.munB.abatementByUse["Senior Apartments"]
        ),
        Hotel: calc(localAssumptions.munB.abatementByUse["Hotel"]),
      },
    },
  };

  setLocalAssumptions(updatedAssumptions);
}, [
  localAssumptions.devBase.baseValue,
  localAssumptions.devBase.totalAcres,
  localAssumptions.munA.abatementByUse["Land Growth"].abatementFraction,
  localAssumptions.munA.abatementByUse["Land Growth"].cdcFraction,
  localAssumptions.munA.abatementByUse["Apartments"].abatementFraction,
  localAssumptions.munA.abatementByUse["Apartments"].cdcFraction,
  localAssumptions.munA.abatementByUse["For Sale Residential"].abatementFraction,
  localAssumptions.munA.abatementByUse["For Sale Residential"].cdcFraction,
  localAssumptions.munA.abatementByUse["Office"].abatementFraction,
  localAssumptions.munA.abatementByUse["Office"].cdcFraction,
  localAssumptions.munA.abatementByUse["Retail"].abatementFraction,
  localAssumptions.munA.abatementByUse["Retail"].cdcFraction,
  localAssumptions.munA.abatementByUse["Senior Apartments"].abatementFraction,
  localAssumptions.munA.abatementByUse["Senior Apartments"].cdcFraction,
  localAssumptions.munA.abatementByUse["Hotel"].abatementFraction,
  localAssumptions.munA.abatementByUse["Hotel"].cdcFraction,
  localAssumptions.munB.abatementByUse["Land Growth"].abatementFraction,
  localAssumptions.munB.abatementByUse["Land Growth"].cdcFraction,
  localAssumptions.munB.abatementByUse["Apartments"].abatementFraction,
  localAssumptions.munB.abatementByUse["Apartments"].cdcFraction,
  localAssumptions.munB.abatementByUse["For Sale Residential"].abatementFraction,
  localAssumptions.munB.abatementByUse["For Sale Residential"].cdcFraction,
  localAssumptions.munB.abatementByUse["Office"].abatementFraction,
  localAssumptions.munB.abatementByUse["Office"].cdcFraction,
  localAssumptions.munB.abatementByUse["Retail"].abatementFraction,
  localAssumptions.munB.abatementByUse["Retail"].cdcFraction,
  localAssumptions.munB.abatementByUse["Senior Apartments"].abatementFraction,
  localAssumptions.munB.abatementByUse["Senior Apartments"].cdcFraction,
  localAssumptions.munB.abatementByUse["Hotel"].abatementFraction,
  localAssumptions.munB.abatementByUse["Hotel"].cdcFraction
  
]);

  const handleRecalculate = () => {
    updateAssumptions(localAssumptions);
    recalculate();
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    try {
      const success = await saveAssumptions(localAssumptions);
      if (success) {
        setSaveMessage('Changes saved successfully');
        setTimeout(() => setSaveMessage(null), 3000);
      } else {
        setSaveMessage('Failed to save changes');
        setTimeout(() => setSaveMessage(null), 5000);
      }
    } catch (error) {
      setSaveMessage('Error saving changes');
      setTimeout(() => setSaveMessage(null), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    setLocalAssumptions(assumptions);
  }, [assumptions]);


  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Loading assumptions...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Model Assumptions</h1>
        <p className="text-gray-600">Configure all model inputs and parameters</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Development Base Value Details</CardTitle>
            <CardDescription>Overall development land value parameters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField
                label="Total Acres"
                value={localAssumptions.devBase.totalAcres}
                onChange={(v) =>
                  setLocalAssumptions({
                    ...localAssumptions,
                    devBase: { ...localAssumptions.devBase, totalAcres: v },
                  })
                }
                min={0}
              />
              <InputField
                label="Total Base Land Value ($)"
                value={localAssumptions.devBase.baseValue}
                onChange={(v) =>
                  setLocalAssumptions({
                    ...localAssumptions,
                    devBase: { ...localAssumptions.devBase, baseValue: v },
                  })
                }
                step={1000}
                min={0}
              />
              <InputField
                label="Base Value per Acre ($)"
                value={localAssumptions.devBase.basePerAcre}
                onChange={() => {}}
                disabled
                step={1}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Development Composition</CardTitle>
            <CardDescription>Details for each development type</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="apartments" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="apartments">Apartments</TabsTrigger>
                <TabsTrigger value="sfhomes">SF Homes</TabsTrigger>
                <TabsTrigger value="office">Office</TabsTrigger>
                <TabsTrigger value="condos">Condos</TabsTrigger>
              </TabsList>

              <TabsContent value="apartments" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <InputField
                    label="Completion Year"
                    value={localAssumptions.apartments.completionYear}
                    onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        apartments: { ...localAssumptions.apartments, completionYear: v },
                      })
                    }
                  />
                  <InputField
                    label="Acreage"
                    value={localAssumptions.apartments.acreage}
                    onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        apartments: { ...localAssumptions.apartments, acreage: v },
                      })
                    }
                    step={0.1}
                  />
                  <InputField
                    label="Units"
                    value={localAssumptions.apartments.unitsOrSF}
                    onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        apartments: { ...localAssumptions.apartments, unitsOrSF: v },
                      })
                    }
                  />
                  <InputField
                    label="Value per Unit ($)"
                    value={localAssumptions.apartments.valuePerUnit}
                    onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        apartments: { ...localAssumptions.apartments, valuePerUnit: v },
                      })
                    }
                    step={1000}
                  />
                </div>
              </TabsContent>

              <TabsContent value="sfhomes" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <InputField
                    label="Completion Year"
                    value={localAssumptions.sfHomes.completionYear}
                    onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        sfHomes: { ...localAssumptions.sfHomes, completionYear: v },
                      })
                    }
                  />
                  <InputField
                    label="Acreage"
                    value={localAssumptions.sfHomes.acreage}
                    onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        sfHomes: { ...localAssumptions.sfHomes, acreage: v },
                      })
                    }
                    step={0.1}
                  />
                  <InputField
                    label="Units"
                    value={localAssumptions.sfHomes.unitsOrSF}
                    onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        sfHomes: { ...localAssumptions.sfHomes, unitsOrSF: v },
                      })
                    }
                  />
                  <InputField
                    label="Value per Unit ($)"
                    value={localAssumptions.sfHomes.valuePerUnit}
                    onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        sfHomes: { ...localAssumptions.sfHomes, valuePerUnit: v },
                      })
                    }
                    step={1000}
                  />
                </div>
              </TabsContent>

              <TabsContent value="office" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <InputField
                    label="Completion Year"
                    value={localAssumptions.office.completionYear}
                    onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        office: { ...localAssumptions.office, completionYear: v },
                      })
                    }
                  />
                  <InputField
                    label="Acreage"
                    value={localAssumptions.office.acreage}
                    onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        office: { ...localAssumptions.office, acreage: v },
                      })
                    }
                    step={0.1}
                  />
                  <InputField
                    label="Square Feet"
                    value={localAssumptions.office.unitsOrSF}
                    onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        office: { ...localAssumptions.office, unitsOrSF: v },
                      })
                    }
                  />
                  <InputField
                    label="Value per SF ($)"
                    value={localAssumptions.office.valuePerUnit}
                    onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        office: { ...localAssumptions.office, valuePerUnit: v },
                      })
                    }
                    step={1}
                  />
                </div>
              </TabsContent>

              <TabsContent value="condos" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <InputField
                    label="Completion Year"
                    value={localAssumptions.condos.completionYear}
                    onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        condos: { ...localAssumptions.condos, completionYear: v },
                      })
                    }
                  />
                  <InputField
                    label="Acreage"
                    value={localAssumptions.condos.acreage}
                    onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        condos: { ...localAssumptions.condos, acreage: v },
                      })
                    }
                    step={0.1}
                  />
                  <InputField
                    label="Units"
                    value={localAssumptions.condos.unitsOrSF}
                    onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        condos: { ...localAssumptions.condos, unitsOrSF: v },
                      })
                    }
                  />
                  <InputField
                    label="Value per Unit ($)"
                    value={localAssumptions.condos.valuePerUnit}
                    onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        condos: { ...localAssumptions.condos, valuePerUnit: v },
                      })
                    }
                    step={1000}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>A Bond Assumptions</CardTitle>
            <CardDescription>Bond parameters and targets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InputField
                label="NPV Discount Rate"
                value={localAssumptions.bond.discountRateNPV}
                onChange={(v) =>
                  setLocalAssumptions({
                    ...localAssumptions,
                    bond: { ...localAssumptions.bond, discountRateNPV: v },
                  })
                }
                step={0.001}
              />
              <InputField
                label="Capitalized Interest Rate"
                value={localAssumptions.bond.capitalizedInterestRate}
                onChange={(v) =>
                  setLocalAssumptions({
                    ...localAssumptions,
                    bond: { ...localAssumptions.bond, capitalizedInterestRate: v },
                  })
                }
                step={0.001}
              />
              <InputField
                label="Issuance Cost Rate"
                value={localAssumptions.bond.issuanceCostRate}
                onChange={(v) =>
                  setLocalAssumptions({
                    ...localAssumptions,
                    bond: { ...localAssumptions.bond, issuanceCostRate: v },
                  })
                }
                step={0.001}
              />
              <InputField
                label="Reserve Rate"
                value={localAssumptions.bond.reserveRate}
                onChange={(v) =>
                  setLocalAssumptions({
                    ...localAssumptions,
                    bond: { ...localAssumptions.bond, reserveRate: v },
                  })
                }
                step={0.01}
              />
              <InputField
                label="Debt Coverage Ratio Target"
                value={localAssumptions.bond.debtCoverageRatioTarget}
                onChange={(v) =>
                  setLocalAssumptions({
                    ...localAssumptions,
                    bond: { ...localAssumptions.bond, debtCoverageRatioTarget: v },
                  })
                }
                step={0.1}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Municipality A - Tax Rates</CardTitle>
            <CardDescription>School and non-school tax rates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <InputField
                label="School Residential Rate"
                value={localAssumptions.munA.taxRates.schoolResidentialRate}
                onChange={(v) =>
                  setLocalAssumptions({
                    ...localAssumptions,
                    munA: {
                      ...localAssumptions.munA,
                      taxRates: { ...localAssumptions.munA.taxRates, schoolResidentialRate: v },
                    },
                  })
                }
                step={0.001}
              />
              <InputField
                label="School Commercial Rate"
                value={localAssumptions.munA.taxRates.schoolCommercialRate}
                onChange={(v) =>
                  setLocalAssumptions({
                    ...localAssumptions,
                    munA: {
                      ...localAssumptions.munA,
                      taxRates: { ...localAssumptions.munA.taxRates, schoolCommercialRate: v },
                    },
                  })
                }
                step={0.001}
              />
              <InputField
                label="Non-School Residential Rate"
                value={localAssumptions.munA.taxRates.nonSchoolResidentialRate}
                onChange={(v) =>
                  setLocalAssumptions({
                    ...localAssumptions,
                    munA: {
                      ...localAssumptions.munA,
                      taxRates: { ...localAssumptions.munA.taxRates, nonSchoolResidentialRate: v },
                    },
                  })
                }
                step={0.001}
              />
              <InputField
                label="Non-School Commercial Rate"
                value={localAssumptions.munA.taxRates.nonSchoolCommercialRate}
                onChange={(v) =>
                  setLocalAssumptions({
                    ...localAssumptions,
                    munA: {
                      ...localAssumptions.munA,
                      taxRates: { ...localAssumptions.munA.taxRates, nonSchoolCommercialRate: v },
                    },
                  })
                }
                step={0.001}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Municipality B - Reappraisal Rates</CardTitle>
            <CardDescription>Inflation and reappraisal parameters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Minor Reappraisal Rate"
                value={localAssumptions.munB.minorReappraisalRate || 0}
                onChange={(v) =>
                  setLocalAssumptions({
                    ...localAssumptions,
                    munB: { ...localAssumptions.munB, minorReappraisalRate: v },
                  })
                }
                step={0.001}
              />
              <InputField
                label="Major Reappraisal Rate"
                value={localAssumptions.munB.majorReappraisalRate || 0}
                onChange={(v) =>
                  setLocalAssumptions({
                    ...localAssumptions,
                    munB: { ...localAssumptions.munB, majorReappraisalRate: v },
                  })
                }
                step={0.001}
              />
            </div>
          </CardContent>
        </Card>

        
        <Card>
          <CardHeader>
            <CardTitle>Abatement Structure - Municipality A</CardTitle>
            <CardDescription>Details for Abatement Structure - Municipality A</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="landgrowth" className="w-full">
              <TabsList className="grid w-full grid-cols-7">
                <TabsTrigger value="landgrowth">Land Growth</TabsTrigger>
                <TabsTrigger value="apartments">Apartments</TabsTrigger>
                <TabsTrigger value="forsaleresidential">For Sale Residential</TabsTrigger>
                <TabsTrigger value="office">Office</TabsTrigger>
                <TabsTrigger value="retail">Retail</TabsTrigger>
                <TabsTrigger value="seniorapartments">Senior Apartments</TabsTrigger>
                <TabsTrigger value="hotel">Hotel</TabsTrigger>
              </TabsList>

              <TabsContent value="landgrowth" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <InputField
                    label="Term Years"
                    value={localAssumptions.munA.abatementByUse["Land Growth"].termYears}
                    onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        munA: { ...localAssumptions.munA, abatementByUse: { ...localAssumptions.munA.abatementByUse, "Land Growth": { ...localAssumptions.munA.abatementByUse["Land Growth"], termYears: v } } },
                      })
                    }
                  />
                  <InputField
                    label="Abatement"
                    value={localAssumptions.munA.abatementByUse["Land Growth"].abatementFraction}
                    onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        munA: { ...localAssumptions.munA, abatementByUse: { ...localAssumptions.munA.abatementByUse, "Land Growth": { ...localAssumptions.munA.abatementByUse["Land Growth"], abatementFraction: v } } },
                      })
                    }
                    step={0.1}
                  />
                  <InputField
                label="Non-abated"
                value={localAssumptions.munA.abatementByUse["Land Growth"].nonAbatedFraction}
                onChange={() => {}}
                disabled
                step={1}
              />
                  <InputField
                    label="CDC"
                    value={localAssumptions.munA.abatementByUse["Land Growth"].cdcFraction}
                    onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        munA: { ...localAssumptions.munA, abatementByUse: { ...localAssumptions.munA.abatementByUse, "Land Growth": { ...localAssumptions.munA.abatementByUse["Land Growth"], cdcFraction: v } } },
                      })
                    }
                    step={1000}
                  />
                  <InputField
                label="Retained"
                value={localAssumptions.munA.abatementByUse["Land Growth"].retainedFraction}
                onChange={() => {}}
                disabled
                step={1}
              />
                </div>
              </TabsContent>

              <TabsContent value="apartments" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <InputField
                    label="Term Years"
                    value={localAssumptions.munA.abatementByUse["Apartments"].termYears}
                    onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        munA: { ...localAssumptions.munA, abatementByUse: { ...localAssumptions.munA.abatementByUse, "Apartments": { ...localAssumptions.munA.abatementByUse["Apartments"], termYears: v } } },
                      })
                    }
                  />
                  <InputField
                    label="Abatement"
                    value={localAssumptions.munA.abatementByUse["Apartments"].abatementFraction}
                    onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        munA: { ...localAssumptions.munA, abatementByUse: { ...localAssumptions.munA.abatementByUse, "Apartments": { ...localAssumptions.munA.abatementByUse["Apartments"], abatementFraction: v } } },
                      })
                    }
                    step={0.1}
                  />
                  <InputField
                label="Non-abated"
                value={localAssumptions.munA.abatementByUse["Apartments"].nonAbatedFraction}
                onChange={() => {}}
                disabled
                step={1}
              />
                  <InputField
                    label="CDC"
                    value={localAssumptions.munA.abatementByUse["Apartments"].cdcFraction}
                    onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        munA: { ...localAssumptions.munA, abatementByUse: { ...localAssumptions.munA.abatementByUse, "Apartments": { ...localAssumptions.munA.abatementByUse["Apartments"], cdcFraction: v } } },
                      })
                    }
                    step={1000}
                  />
                  <InputField
                label="Retained"
                value={localAssumptions.munA.abatementByUse["Apartments"].retainedFraction}
                onChange={() => {}}
                disabled
                step={1}
              />
                </div>
              </TabsContent>

              <TabsContent value="forsaleresidential" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <InputField
                    label="Term Years"
                    value={localAssumptions.munA.abatementByUse["For Sale Residential"].termYears}
                    onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        munA: { ...localAssumptions.munA, abatementByUse: { ...localAssumptions.munA.abatementByUse, "For Sale Residential": { ...localAssumptions.munA.abatementByUse["For Sale Residential"], termYears: v } } },
                      })
                    }
                  />
                  <InputField
                    label="Abatement"
                    value={localAssumptions.munA.abatementByUse["For Sale Residential"].abatementFraction}
                    onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        munA: { ...localAssumptions.munA, abatementByUse: { ...localAssumptions.munA.abatementByUse, "For Sale Residential": { ...localAssumptions.munA.abatementByUse["For Sale Residential"], abatementFraction: v } } },
                      })
                    }
                    step={0.1}
                  />
                  <InputField
                label="Non-abated"
                value={localAssumptions.munA.abatementByUse["For Sale Residential"].nonAbatedFraction}
                onChange={() => {}}
                disabled
                step={1}
              />
                  <InputField
                    label="CDC"
                    value={localAssumptions.munA.abatementByUse["For Sale Residential"].cdcFraction}
                    onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        munA: { ...localAssumptions.munA, abatementByUse: { ...localAssumptions.munA.abatementByUse, "For Sale Residential": { ...localAssumptions.munA.abatementByUse["For Sale Residential"], cdcFraction: v } } },
                      })
                    }
                    step={1000}
                  />
                  <InputField
                label="Retained"
                value={localAssumptions.munA.abatementByUse["For Sale Residential"].retainedFraction}
                onChange={() => {}}
                disabled
                step={1}
              />
                </div>
              </TabsContent>

              <TabsContent value="office" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <InputField
                    label="Term Years"
                    value={localAssumptions.munA.abatementByUse["Office"].termYears}
                    onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        munA: { ...localAssumptions.munA, abatementByUse: { ...localAssumptions.munA.abatementByUse, "Office": { ...localAssumptions.munA.abatementByUse["Office"], termYears: v } } },
                      })
                    }
                  />
                  <InputField
                    label="Abatement"
                    value={localAssumptions.munA.abatementByUse["Office"].abatementFraction}
                    onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        munA: { ...localAssumptions.munA, abatementByUse: { ...localAssumptions.munA.abatementByUse, "Office": { ...localAssumptions.munA.abatementByUse["Office"], abatementFraction: v } } },
                      })
                    }
                    step={0.1}
                  />
                  <InputField
                label="Non-abated"
                value={localAssumptions.munA.abatementByUse["Office"].nonAbatedFraction}
                onChange={() => {}}
                disabled
                step={1}
              />
                  <InputField
                    label="CDC"
                    value={localAssumptions.munA.abatementByUse["Office"].cdcFraction}
                    onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        munA: { ...localAssumptions.munA, abatementByUse: { ...localAssumptions.munA.abatementByUse, "Office": { ...localAssumptions.munA.abatementByUse["Office"], cdcFraction: v } } },
                      })
                    }
                    step={1000}
                  />
                  <InputField
                label="Retained"
                value={localAssumptions.munA.abatementByUse["Office"].retainedFraction}
                onChange={() => {}}
                disabled
                step={1}
              />
                </div>
              </TabsContent>

              <TabsContent value="retail" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <InputField
                    label="Term Years"
                    value={localAssumptions.munA.abatementByUse["Retail"].termYears}
                    onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        munA: { ...localAssumptions.munA, abatementByUse: { ...localAssumptions.munA.abatementByUse, "Retail": { ...localAssumptions.munA.abatementByUse["Retail"], termYears: v } } },
                      })
                    }
                  />
                  <InputField
                    label="Abatement"
                    value={localAssumptions.munA.abatementByUse["Retail"].abatementFraction}
                    onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        munA: { ...localAssumptions.munA, abatementByUse: { ...localAssumptions.munA.abatementByUse, "Retail": { ...localAssumptions.munA.abatementByUse["Retail"], abatementFraction: v } } },
                      })
                    }
                    step={0.1}
                  />
                  <InputField
                label="Non-abated"
                value={localAssumptions.munA.abatementByUse["Retail"].nonAbatedFraction}
                onChange={() => {}}
                disabled
                step={1}
              />
                  <InputField
                    label="CDC"
                    value={localAssumptions.munA.abatementByUse["Retail"].cdcFraction}
                    onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        munA: { ...localAssumptions.munA, abatementByUse: { ...localAssumptions.munA.abatementByUse, "Retail": { ...localAssumptions.munA.abatementByUse["Retail"], cdcFraction: v } } },
                      })
                    }
                    step={1000}
                  />
                  <InputField
                label="Retained"
                value={localAssumptions.munA.abatementByUse["Retail"].retainedFraction}
                onChange={() => {}}
                disabled
                step={1}
              />
                </div>
              </TabsContent>
              <TabsContent value="seniorapartments" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <InputField
                    label="Term Years"
                    value={localAssumptions.munA.abatementByUse["Senior Apartments"].termYears}
                    onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        munA: { ...localAssumptions.munA, abatementByUse: { ...localAssumptions.munA.abatementByUse, "Senior Apartments": { ...localAssumptions.munA.abatementByUse["Senior Apartments"], termYears: v } } },
                      })
                    }
                  />
                  <InputField
                    label="Abatement"
                    value={localAssumptions.munA.abatementByUse["Senior Apartments"].abatementFraction}
                    onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        munA: { ...localAssumptions.munA, abatementByUse: { ...localAssumptions.munA.abatementByUse, "Senior Apartments": { ...localAssumptions.munA.abatementByUse["Senior Apartments"], abatementFraction: v } } },
                      })
                    }
                    step={0.1}
                  />
                  <InputField
                label="Non-abated"
                value={localAssumptions.munA.abatementByUse["Senior Apartments"].nonAbatedFraction}
                onChange={() => {}}
                disabled
                step={1}
              />
                  <InputField
                    label="CDC"
                    value={localAssumptions.munA.abatementByUse["Senior Apartments"].cdcFraction}
                    onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        munA: { ...localAssumptions.munA, abatementByUse: { ...localAssumptions.munA.abatementByUse, "Senior Apartments": { ...localAssumptions.munA.abatementByUse["Senior Apartments"], cdcFraction: v } } },
                      })
                    }
                    step={1000}
                  />
                  <InputField
                label="Retained"
                value={localAssumptions.munA.abatementByUse["Senior Apartments"].retainedFraction}
                onChange={() => {}}
                disabled
                step={1}
              />
                </div>
              </TabsContent>
              <TabsContent value="hotel" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <InputField
                    label="Term Years"
                    value={localAssumptions.munA.abatementByUse["Hotel"].termYears}
                    onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        munA: { ...localAssumptions.munA, abatementByUse: { ...localAssumptions.munA.abatementByUse, "Hotel": { ...localAssumptions.munA.abatementByUse["Hotel"], termYears: v } } },
                      })
                    }
                  />
                  <InputField
                    label="Abatement"
                    value={localAssumptions.munA.abatementByUse["Hotel"].abatementFraction}
                    onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        munA: { ...localAssumptions.munA, abatementByUse: { ...localAssumptions.munA.abatementByUse, "Hotel": { ...localAssumptions.munA.abatementByUse["Hotel"], abatementFraction: v } } },
                      })
                    }
                    step={0.1}
                  />
                  <InputField
                label="Non-abated"
                value={localAssumptions.munA.abatementByUse["Hotel"].nonAbatedFraction}
                onChange={() => {}}
                disabled
                step={1}
              />
                  <InputField
                    label="CDC"
                    value={localAssumptions.munA.abatementByUse["Hotel"].cdcFraction}
                    onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        munA: { ...localAssumptions.munA, abatementByUse: { ...localAssumptions.munA.abatementByUse, "Hotel": { ...localAssumptions.munA.abatementByUse["Hotel"], cdcFraction: v } } },
                      })
                    }
                    step={1000}
                  />
                  <InputField
                label="Retained"
                value={localAssumptions.munA.abatementByUse["Hotel"].retainedFraction}
                onChange={() => {}}
                disabled
                step={1}
              />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Abatement Structure - Municipality B</CardTitle>
            <CardDescription>Details for Abatement Structure - Municipality B</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="landgrowth" className="w-full">
              <TabsList className="grid w-full grid-cols-7">
                <TabsTrigger value="landgrowth">Land Growth</TabsTrigger>
                <TabsTrigger value="apartments">Apartments</TabsTrigger>
                <TabsTrigger value="forsaleresidential">For Sale Residential</TabsTrigger>
                <TabsTrigger value="office">Office</TabsTrigger>
                <TabsTrigger value="retail">Retail</TabsTrigger>
                <TabsTrigger value="seniorapartments">Senior Apartments</TabsTrigger>
                <TabsTrigger value="hotel">Hotel</TabsTrigger>
              </TabsList>

              <TabsContent value="landgrowth" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <InputField
                    label="Term Years"
                    value={localAssumptions.munB.abatementByUse["Land Growth"].termYears}
                    onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        munB: { ...localAssumptions.munB, abatementByUse: { ...localAssumptions.munB.abatementByUse, "Land Growth": { ...localAssumptions.munB.abatementByUse["Land Growth"], termYears: v } } },
                      })
                    }
                  />
                  <InputField
                    label="Abatement"
                    value={localAssumptions.munB.abatementByUse["Land Growth"].abatementFraction}
                    onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        munB: { ...localAssumptions.munB, abatementByUse: { ...localAssumptions.munB.abatementByUse, "Land Growth": { ...localAssumptions.munB.abatementByUse["Land Growth"], abatementFraction: v } } },
                      })
                    }
                    step={0.1}
                  />
                  <InputField
                label="Non-abated"
                value={localAssumptions.munB.abatementByUse["Land Growth"].nonAbatedFraction}
                onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        munB: { ...localAssumptions.munB, abatementByUse: { ...localAssumptions.munB.abatementByUse, "Land Growth": { ...localAssumptions.munB.abatementByUse["Land Growth"], nonAbatedFraction: v } } },
                      })
                    }
                disabled
                step={1}
              />
                  <InputField
                    label="CDC"
                    value={localAssumptions.munB.abatementByUse["Land Growth"].cdcFraction}
                    onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        munB: { ...localAssumptions.munB, abatementByUse: { ...localAssumptions.munB.abatementByUse, "Land Growth": { ...localAssumptions.munB.abatementByUse["Land Growth"], cdcFraction: v } } },
                      })
                    }
                    step={1000}
                  />
                  <InputField
                label="Retained"
                value={localAssumptions.munB.abatementByUse["Land Growth"].retainedFraction}
                onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        munB: { ...localAssumptions.munB, abatementByUse: { ...localAssumptions.munB.abatementByUse, "Land Growth": { ...localAssumptions.munB.abatementByUse["Land Growth"], retainedFraction: v } } },
                      })
                    }
                disabled
                step={1}
              />
                </div>
              </TabsContent>

              <TabsContent value="apartments" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <InputField
                    label="Term Years"
                    value={localAssumptions.munB.abatementByUse["Apartments"].termYears}
                    onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        munB: { ...localAssumptions.munB, abatementByUse: { ...localAssumptions.munB.abatementByUse, "Apartments": { ...localAssumptions.munB.abatementByUse["Apartments"], termYears: v } } },
                      })
                    }
                  />
                  <InputField
                    label="Abatement"
                    value={localAssumptions.munB.abatementByUse["Apartments"].abatementFraction}
                    onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        munB: { ...localAssumptions.munB, abatementByUse: { ...localAssumptions.munB.abatementByUse, "Apartments": { ...localAssumptions.munB.abatementByUse["Apartments"], abatementFraction: v } } },
                      })
                    }
                    step={0.1}
                  />
                  <InputField
                label="Non-abated"
                value={localAssumptions.munB.abatementByUse["Apartments"].nonAbatedFraction}
                onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        munB: { ...localAssumptions.munB, abatementByUse: { ...localAssumptions.munB.abatementByUse, "Apartments": { ...localAssumptions.munB.abatementByUse["Apartments"], nonAbatedFraction: v } } },
                      })
                    }
                disabled
                step={1}
              />
                  <InputField
                    label="CDC"
                    value={localAssumptions.munB.abatementByUse["Apartments"].cdcFraction}
                    onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        munB: { ...localAssumptions.munB, abatementByUse: { ...localAssumptions.munB.abatementByUse, "Apartments": { ...localAssumptions.munB.abatementByUse["Apartments"], cdcFraction: v } } },
                      })
                    }
                    step={1000}
                  />
                  <InputField
                label="Retained"
                value={localAssumptions.munB.abatementByUse["Apartments"].retainedFraction}
                onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        munB: { ...localAssumptions.munB, abatementByUse: { ...localAssumptions.munB.abatementByUse, "Apartments": { ...localAssumptions.munB.abatementByUse["Apartments"], retainedFraction: v } } },
                      })
                    }
                disabled
                step={1}
              />
                </div>
              </TabsContent>

              <TabsContent value="forsaleresidential" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <InputField
                    label="Term Years"
                    value={localAssumptions.munB.abatementByUse["For Sale Residential"].termYears}
                    onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        munB: { ...localAssumptions.munB, abatementByUse: { ...localAssumptions.munB.abatementByUse, "For Sale Residential": { ...localAssumptions.munB.abatementByUse["For Sale Residential"], termYears: v } } },
                      })
                    }
                  />
                  <InputField
                    label="Abatement"
                    value={localAssumptions.munB.abatementByUse["For Sale Residential"].abatementFraction}
                    onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        munB: { ...localAssumptions.munB, abatementByUse: { ...localAssumptions.munB.abatementByUse, "For Sale Residential": { ...localAssumptions.munB.abatementByUse["For Sale Residential"], abatementFraction: v } } },
                      })
                    }
                    step={0.1}
                  />
                  <InputField
                label="Non-abated"
                value={localAssumptions.munB.abatementByUse["For Sale Residential"].nonAbatedFraction}
                onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        munB: { ...localAssumptions.munB, abatementByUse: { ...localAssumptions.munB.abatementByUse, "For Sale Residential": { ...localAssumptions.munB.abatementByUse["For Sale Residential"], nonAbatedFraction: v } } },
                      })
                    }
                disabled
                step={1}
              />
                  <InputField
                    label="CDC"
                    value={localAssumptions.munB.abatementByUse["For Sale Residential"].cdcFraction}
                    onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        munB: { ...localAssumptions.munB, abatementByUse: { ...localAssumptions.munB.abatementByUse, "For Sale Residential": { ...localAssumptions.munB.abatementByUse["For Sale Residential"], cdcFraction: v } } },
                      })
                    }
                    step={1000}
                  />
                  <InputField
                label="Retained"
                value={localAssumptions.munB.abatementByUse["For Sale Residential"].retainedFraction}
                onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        munB: { ...localAssumptions.munB, abatementByUse: { ...localAssumptions.munB.abatementByUse, "For Sale Residential": { ...localAssumptions.munB.abatementByUse["For Sale Residential"], retainedFraction: v } } },
                      })
                    }
                disabled
                step={1}
              />
                </div>
              </TabsContent>

              <TabsContent value="office" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <InputField
                    label="Term Years"
                    value={localAssumptions.munB.abatementByUse["Office"].termYears}
                    onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        munB: { ...localAssumptions.munB, abatementByUse: { ...localAssumptions.munB.abatementByUse, "Office": { ...localAssumptions.munB.abatementByUse["Office"], termYears: v } } },
                      })
                    }
                  />
                  <InputField
                    label="Abatement"
                    value={localAssumptions.munB.abatementByUse["Office"].abatementFraction}
                    onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        munB: { ...localAssumptions.munB, abatementByUse: { ...localAssumptions.munB.abatementByUse, "Office": { ...localAssumptions.munB.abatementByUse["Office"], abatementFraction: v } } },
                      })
                    }
                    step={0.1}
                  />
                  <InputField
                label="Non-abated"
                value={localAssumptions.munB.abatementByUse["Office"].nonAbatedFraction}
                onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        munB: { ...localAssumptions.munB, abatementByUse: { ...localAssumptions.munB.abatementByUse, "Office": { ...localAssumptions.munB.abatementByUse["Office"], nonAbatedFraction: v } } },
                      })
                    }
                disabled
                step={1}
              />
                  <InputField
                    label="CDC"
                    value={localAssumptions.munB.abatementByUse["Office"].cdcFraction}
                    onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        munB: { ...localAssumptions.munB, abatementByUse: { ...localAssumptions.munB.abatementByUse, "Office": { ...localAssumptions.munB.abatementByUse["Office"], cdcFraction: v } } },
                      })
                    }
                    step={1000}
                  />
                  <InputField
                label="Retained"
                value={localAssumptions.munB.abatementByUse["Office"].retainedFraction}
                onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        munB: { ...localAssumptions.munB, abatementByUse: { ...localAssumptions.munB.abatementByUse, "Office": { ...localAssumptions.munB.abatementByUse["Office"], retainedFraction: v } } },
                      })
                    }
                disabled
                step={1}
              />
                </div>
              </TabsContent>

              <TabsContent value="retail" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <InputField
                    label="Term Years"
                    value={localAssumptions.munB.abatementByUse["Retail"].termYears}
                    onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        munB: { ...localAssumptions.munB, abatementByUse: { ...localAssumptions.munB.abatementByUse, "Retail": { ...localAssumptions.munB.abatementByUse["Retail"], termYears: v } } },
                      })
                    }
                  />
                  <InputField
                    label="Abatement"
                    value={localAssumptions.munB.abatementByUse["Retail"].abatementFraction}
                    onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        munB: { ...localAssumptions.munB, abatementByUse: { ...localAssumptions.munB.abatementByUse, "Retail": { ...localAssumptions.munB.abatementByUse["Retail"], abatementFraction: v } } },
                      })
                    }
                    step={0.1}
                  />
                  <InputField
                label="Non-abated"
                value={localAssumptions.munB.abatementByUse["Retail"].nonAbatedFraction}
                onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        munB: { ...localAssumptions.munB, abatementByUse: { ...localAssumptions.munB.abatementByUse, "Retail": { ...localAssumptions.munB.abatementByUse["Retail"], nonAbatedFraction: v } } },
                      })
                    }
                disabled
                step={1}
              />
                  <InputField
                    label="CDC"
                    value={localAssumptions.munB.abatementByUse["Retail"].cdcFraction}
                    onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        munB: { ...localAssumptions.munB, abatementByUse: { ...localAssumptions.munB.abatementByUse, "Retail": { ...localAssumptions.munB.abatementByUse["Retail"], cdcFraction: v } } },
                      })
                    }
                    step={1000}
                  />
                  <InputField
                label="Retained"
                value={localAssumptions.munB.abatementByUse["Retail"].retainedFraction}
                onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        munB: { ...localAssumptions.munB, abatementByUse: { ...localAssumptions.munB.abatementByUse, "Retail": { ...localAssumptions.munB.abatementByUse["Retail"], retainedFraction: v } } },
                      })
                    }
                disabled
                step={1}
              />
                </div>
              </TabsContent>
              <TabsContent value="seniorapartments" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <InputField
                    label="Term Years"
                    value={localAssumptions.munB.abatementByUse["Senior Apartments"].termYears}
                    onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        munB: { ...localAssumptions.munB, abatementByUse: { ...localAssumptions.munB.abatementByUse, "Senior Apartments": { ...localAssumptions.munB.abatementByUse["Senior Apartments"], termYears: v } } },
                      })
                    }
                  />
                  <InputField
                    label="Abatement"
                    value={localAssumptions.munB.abatementByUse["Senior Apartments"].abatementFraction}
                    onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        munB: { ...localAssumptions.munB, abatementByUse: { ...localAssumptions.munB.abatementByUse, "Senior Apartments": { ...localAssumptions.munB.abatementByUse["Senior Apartments"], abatementFraction: v } } },
                      })
                    }
                    step={0.1}
                  />
                  <InputField
                label="Non-abated"
                value={localAssumptions.munB.abatementByUse["Senior Apartments"].nonAbatedFraction}
                onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        munB: { ...localAssumptions.munB, abatementByUse: { ...localAssumptions.munB.abatementByUse, "Senior Apartments": { ...localAssumptions.munB.abatementByUse["Senior Apartments"], nonAbatedFraction: v } } },
                      })
                    }
                disabled
                step={1}
              />
                  <InputField
                    label="CDC"
                    value={localAssumptions.munB.abatementByUse["Senior Apartments"].cdcFraction}
                    onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        munB: { ...localAssumptions.munB, abatementByUse: { ...localAssumptions.munB.abatementByUse, "Senior Apartments": { ...localAssumptions.munB.abatementByUse["Senior Apartments"], cdcFraction: v } } },
                      })
                    }
                    step={1000}
                  />
                  <InputField
                label="Retained"
                value={localAssumptions.munB.abatementByUse["Senior Apartments"].retainedFraction}
                onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        munB: { ...localAssumptions.munB, abatementByUse: { ...localAssumptions.munB.abatementByUse, "Senior Apartments": { ...localAssumptions.munB.abatementByUse["Senior Apartments"], retainedFraction: v } } },
                      })
                    }
                disabled
                step={1}
              />
                </div>
              </TabsContent>
              <TabsContent value="hotel" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <InputField
                    label="Term Years"
                    value={localAssumptions.munB.abatementByUse["Hotel"].termYears}
                    onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        munB: { ...localAssumptions.munB, abatementByUse: { ...localAssumptions.munB.abatementByUse, "Hotel": { ...localAssumptions.munB.abatementByUse["Hotel"], termYears: v } } },
                      })
                    }
                  />
                  <InputField
                    label="Abatement"
                    value={localAssumptions.munB.abatementByUse["Hotel"].abatementFraction}
                    onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        munB: { ...localAssumptions.munB, abatementByUse: { ...localAssumptions.munB.abatementByUse, "Hotel": { ...localAssumptions.munB.abatementByUse["Hotel"], abatementFraction: v } } },
                      })
                    }
                    step={0.1}
                  />
                  <InputField
                label="Non-abated"
                value={localAssumptions.munB.abatementByUse["Hotel"].nonAbatedFraction}
                onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        munB: { ...localAssumptions.munB, abatementByUse: { ...localAssumptions.munB.abatementByUse, "Hotel": { ...localAssumptions.munB.abatementByUse["Hotel"], nonAbatedFraction: v } } },
                      })
                    }
                disabled
                step={1}
              />
                  <InputField
                    label="CDC"
                    value={localAssumptions.munB.abatementByUse["Hotel"].cdcFraction}
                    onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        munB: { ...localAssumptions.munB, abatementByUse: { ...localAssumptions.munB.abatementByUse, "Hotel": { ...localAssumptions.munB.abatementByUse["Hotel"], cdcFraction: v } } },
                      })
                    }
                    step={1000}
                  />
                  <InputField
                label="Retained"
                value={localAssumptions.munB.abatementByUse["Hotel"].retainedFraction}
                onChange={(v) =>
                      setLocalAssumptions({
                        ...localAssumptions,
                        munB: { ...localAssumptions.munB, abatementByUse: { ...localAssumptions.munB.abatementByUse, "Hotel": { ...localAssumptions.munB.abatementByUse["Hotel"], retainedFraction: v } } },
                      })
                    }
                disabled
                step={1}
              />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center gap-4">
          <div className="flex gap-4 items-center">
            <Button onClick={handleRecalculate} size="lg" className="bg-blue-600 hover:bg-blue-700">
              Recalculate Model
            </Button>
            <Button
              onClick={handleSave}
              size="lg"
              className="bg-green-600 hover:bg-green-700"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
            {saveMessage && (
              <div className={`text-sm font-medium ${saveMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                {saveMessage}
              </div>
            )}
          </div>


          {results && (
            <div className="grid grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="text-sm text-gray-600">NPV A Bond</div>
                <div className="text-xl font-bold">
                  ${results.bondSummary.npvBondCashFlow.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600">NPV Excess</div>
                <div className="text-xl font-bold">
                  ${results.bondSummary.npvExcessFromA.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600">Net Revenue</div>
                <div className="text-xl font-bold">
                  ${results.bondSummary.netRevenueToNCA.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600">Surplus</div>
                <div className="text-xl font-bold">
                  ${results.bondSummary.surplus.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
              </Card>
            </div>
          )}
        </div>
        </div>
      </div>
  );
}
