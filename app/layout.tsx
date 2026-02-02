import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { FinancialProvider } from '@/lib/context/FinancialContext';
import Navigation from '@/components/Navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TIF Financial Model',
  description: 'Tax Increment Financing and Bond Coverage Model',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FinancialProvider>
          <Navigation />
          <main className="min-h-screen bg-gray-50">
            {children}
          </main>
        </FinancialProvider>
      </body>
    </html>
  );
}
