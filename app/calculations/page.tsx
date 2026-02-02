'use client';

import { useFinancial } from '@/lib/context/FinancialContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { YearlyFlow } from '@/types/financial';
import { AlertCircle } from 'lucide-react';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

interface FlowsTableProps {
  flows: YearlyFlow[];
  title: string;
}

function FlowsTable({ flows, title }: FlowsTableProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="overflow-x-auto border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky left-0 bg-white z-10">Index</TableHead>
              <TableHead>Tax Year</TableHead>
              <TableHead>Collection Year</TableHead>
              <TableHead>Land Abatement Year</TableHead>
              <TableHead>Building abatement year</TableHead>
              <TableHead>Inflation Factor</TableHead>
              <TableHead>Cumulative Inflation</TableHead>
              <TableHead>Base Value</TableHead>
              <TableHead>Land Growth</TableHead>
              <TableHead>Improvement</TableHead>
              <TableHead>Full Value</TableHead>
              <TableHead>Full Tax</TableHead>
              <TableHead>Tax to School</TableHead>
              <TableHead>Tax to Non-School</TableHead>
              <TableHead>TIF Collection</TableHead>
              <TableHead>CDC Land</TableHead>
              <TableHead>CDC Improvement</TableHead>
              <TableHead>Construction Service</TableHead>
              <TableHead>Abate. Value Retained</TableHead>
              <TableHead>Total Collections</TableHead>
              <TableHead>Min Service Payments</TableHead>
              <TableHead className="bg-yellow-50">Tax Value Test</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flows.map((flow) => {
              const testFails = Math.abs(flow.taxValueTest) > 0.01;
              return (
                <TableRow key={flow.indexYear}>
                  <TableCell className="sticky left-0 bg-white font-medium">{flow.indexYear}</TableCell>
                  <TableCell>{flow.taxYear}</TableCell>
                  <TableCell>{flow.collectionYear}</TableCell>
                  <TableCell>{flow.landAbatementYear}</TableCell>
                  <TableCell>{flow.buildingAbatementYear}</TableCell>
                  <TableCell>{flow.inflationFactor} </TableCell>
                  <TableCell>{flow.cumulativeInflationFactor} </TableCell>
                  <TableCell>{formatCurrency(flow.baseValue)}</TableCell>
                  <TableCell>{formatCurrency(flow.landGrowth)}</TableCell>
                  <TableCell>{formatCurrency(flow.improvementValue)}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(flow.fullValue)}</TableCell>
                  <TableCell>{formatCurrency(flow.fullTax)}</TableCell>
                  <TableCell>{formatCurrency(flow.taxToSchool)}</TableCell>
                  <TableCell>{formatCurrency(flow.taxToNonSchool)}</TableCell>
                  <TableCell>{formatCurrency(flow.tifCollection)}</TableCell>
                  <TableCell>{formatCurrency(flow.cdcLand)}</TableCell>
                  <TableCell>{formatCurrency(flow.cdcImprovement)}</TableCell>
                  <TableCell>{formatCurrency(flow.constructionServicePayments)}</TableCell>
                  <TableCell>{formatCurrency(flow.abatedValueRetained)}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(flow.totalAnnualCollections)}</TableCell>
                  <TableCell className="font-medium bg-blue-50">{formatCurrency(flow.minimumServicePayments)}</TableCell>
                  <TableCell className={testFails ? 'bg-red-100' : 'bg-green-50'}>
                    <div className="flex items-center gap-2">
                      {testFails && <AlertCircle className="h-4 w-4 text-red-600" />}
                      {formatCurrency(flow.taxValueTest)}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default function CalculationsPage() {
  const { results } = useFinancial();

  if (!results) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">No calculations available. Please go to the Assumptions page and click Recalculate.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Detailed Calculations</h1>
        <p className="text-gray-600">Year-by-year calculations for each development type</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Development Flows by Type</CardTitle>
          <CardDescription>
            Detailed tax calculations, TIF collections, and service payments for each development
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="apartments" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="apartments">Apartments</TabsTrigger>
              <TabsTrigger value="sfhomes">SF Homes</TabsTrigger>
              <TabsTrigger value="office">Office</TabsTrigger>
              <TabsTrigger value="condos">Condos</TabsTrigger>
            </TabsList>

            <TabsContent value="apartments">
              <FlowsTable flows={results.apartmentsFlows} title="Apartments - Phase 1" />
            </TabsContent>

            <TabsContent value="sfhomes">
              <FlowsTable flows={results.sfHomesFlows} title="Single-Family Homes - Phase 2" />
            </TabsContent>

            <TabsContent value="office">
              <FlowsTable flows={results.officeFlows} title="Office - Phase 3" />
            </TabsContent>

            <TabsContent value="condos">
              <FlowsTable flows={results.condosFlows} title="Condos - Phase 4" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Tax Value Test Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <p className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 bg-green-50 border border-green-200 rounded"></span>
              Tax Value Test passes (difference less than $0.01)
            </p>
            <p className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="inline-block w-4 h-4 bg-red-100 border border-red-200 rounded"></span>
              Tax Value Test fails (difference greater than $0.01)
            </p>
            <p className="mt-4 italic">
              The Tax Value Test verifies that total annual collections plus abated value retained equals the full tax amount.
              Values should be near zero for accurate calculations.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
