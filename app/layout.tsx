import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { Toaster } from '@/components/ui/toaster';

import { ThemeProvider } from '@/components/ThemeProvider';
import Navbar from '@/components/Navbar';
import { GroupsProvider } from '@/lib/contexts/GroupsContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Playground',
  description: 'AI Playground',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <GroupsProvider>
            <div className="md:flex md:justify-center">
              <div className="mt-4 mx-4 md:w-[400px]">
                <Navbar />
                {children}
                <Toaster />
              </div>
            </div>
          </GroupsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
