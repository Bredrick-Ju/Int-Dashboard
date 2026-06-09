// ─────────────────────────────────────────────────────────────────────────────
// app/layout.tsx — Root Layout
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next';
import './globals.css';
import { QueryProvider } from '@/providers/QueryProvider';
import { SocketProvider } from '@/providers/SocketProvider';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Worklyft | Real-Time Revenue Operations Dashboard',
  description:
    'Enterprise-grade real-time SaaS dashboard for revenue operations — strategy, channel, activity, lead, and order management with live WebSocket updates.',
  keywords: ['revenue operations', 'sales dashboard', 'real-time analytics', 'SaaS', 'CRM'],
  openGraph: {
    title: 'Worklyft Revenue Ops Dashboard',
    description: 'Real-time SaaS revenue operations dashboard',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <QueryProvider>
          <SocketProvider>
            {children}
            <Toaster
              position="bottom-right"
              theme="dark"
              richColors
              toastOptions={{
                style: {
                  background: 'hsl(224 71% 6%)',
                  border: '1px solid hsl(216 34% 14%)',
                  color: 'hsl(213 31% 91%)',
                },
              }}
            />
          </SocketProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
