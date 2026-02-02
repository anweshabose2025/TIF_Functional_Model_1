'use client';

import { useFinancial } from '@/lib/context/FinancialContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function SummaryPage() {
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

  const handleExportCSV = () => {
    const headers = [
      'Index Year',
      'Tax Year',
      'Collection Year',
      'MSP Phase 1',
      'MSP Phase 2',
      'MSP Phase 3',
      'MSP Phase 4',
      'Total MSP',
      'Cash Flow',
      'Remaining',
      'A Bond Cash Flow',
      'Excess From A',
    ];

    const rows = results.revenueSummary.map((row) => [
      row.indexYear,
      row.taxYear,
      row.collectionYear,
      row.mspPhase1,
      row.mspPhase2,
      row.mspPhase3,
      row.mspPhase4,
      row.totalMsp,
      row.cashFlow,
      row.remaining,
      row.aBondCashFlow,
      row.excessFromA,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'revenue-summary.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const { bondSummary } = results;
  const totalMSP = results.revenueSummary.reduce((sum, row) => sum + row.totalMsp, 0);
  const totalCashFlow = results.revenueSummary.reduce((sum, row) => sum + row.aBondCashFlow, 0);

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Revenue Summary & Bond Analysis</h1>
        <p className="text-gray-600">Key financial metrics and bond coverage analysis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">NPV Bond Cash Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(bondSummary.npvBondCashFlow)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">NPV Excess From A</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(bondSummary.npvExcessFromA)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Net Revenue to NCA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(bondSummary.netRevenueToNCA)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Surplus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(bondSummary.surplus)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Issuance Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">{formatCurrency(bondSummary.issuanceCost)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Capitalized Interest</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">{formatCurrency(bondSummary.capitalizedInterest)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Reserve Contribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">{formatCurrency(bondSummary.reserveContribution)}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Revenue Summary Table</CardTitle>
              <CardDescription>Year-by-year revenue and bond coverage breakdown</CardDescription>
            </div>
            <Button onClick={handleExportCSV} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky left-0 bg-white z-10">Index</TableHead>
                  <TableHead>Tax Year</TableHead>
                  <TableHead>Collection Year</TableHead>
                  <TableHead>MSP Phase 1</TableHead>
                  <TableHead>MSP Phase 2</TableHead>
                  <TableHead>MSP Phase 3</TableHead>
                  <TableHead>MSP Phase 4</TableHead>
                  <TableHead className="bg-blue-50 font-semibold">Total MSP</TableHead>
                  <TableHead>Cash Flow</TableHead>
                  <TableHead>Remaining</TableHead>
                  <TableHead className="bg-green-50">A Bond Cash Flow</TableHead>
                  <TableHead className="bg-green-50">Excess From A</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.revenueSummary.map((row) => (
                  <TableRow key={row.indexYear}>
                    <TableCell className="sticky left-0 bg-white font-medium">{row.indexYear}</TableCell>
                    <TableCell>{row.taxYear}</TableCell>
                    <TableCell>{row.collectionYear}</TableCell>
                    <TableCell>{formatCurrency(row.mspPhase1)}</TableCell>
                    <TableCell>{formatCurrency(row.mspPhase2)}</TableCell>
                    <TableCell>{formatCurrency(row.mspPhase3)}</TableCell>
                    <TableCell>{formatCurrency(row.mspPhase4)}</TableCell>
                    <TableCell className="bg-blue-50 font-semibold">{formatCurrency(row.totalMsp)}</TableCell>
                    <TableCell>{formatCurrency(row.cashFlow)}</TableCell>
                    <TableCell>{formatCurrency(row.remaining)}</TableCell>
                    <TableCell className="bg-green-50 font-medium">{formatCurrency(row.aBondCashFlow)}</TableCell>
                    <TableCell className="bg-green-50 font-medium">{formatCurrency(row.excessFromA)}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-gray-100 font-bold">
                  <TableCell className="sticky left-0 bg-gray-100">TOTALS</TableCell>
                  <TableCell colSpan={6}></TableCell>
                  <TableCell>{formatCurrency(totalMSP)}</TableCell>
                  <TableCell colSpan={2}></TableCell>
                  <TableCell className="bg-green-100">{formatCurrency(totalCashFlow)}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bond Summary Details</CardTitle>
          <CardDescription>Complete bond financial analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Gross Bond Sale</span>
              <span className="font-semibold">{formatCurrency(bondSummary.grossBondSale)}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600 pl-4">Less: Issuance Cost</span>
              <span className="font-semibold text-red-600">({formatCurrency(bondSummary.issuanceCost)})</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600 pl-4">Less: Capitalized Interest</span>
              <span className="font-semibold text-red-600">({formatCurrency(bondSummary.capitalizedInterest)})</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600 pl-4">Less: Reserve Contribution</span>
              <span className="font-semibold text-red-600">({formatCurrency(bondSummary.reserveContribution)})</span>
            </div>
            <div className="flex justify-between py-3 border-t-2 border-gray-300">
              <span className="font-bold text-lg">Net Revenue to NCA</span>
              <span className="font-bold text-lg text-blue-600">{formatCurrency(bondSummary.netRevenueToNCA)}</span>
            </div>
            <div className="flex justify-between py-3 mt-4 bg-green-50 px-4 rounded-lg">
              <span className="font-bold text-lg">Surplus (NPV Excess)</span>
              <span className="font-bold text-lg text-green-600">{formatCurrency(bondSummary.surplus)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
