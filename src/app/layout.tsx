import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Changed to Inter for a clean, readable style
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'RecipeSnap',
  description: 'Generate recipes from photos of your ingredients!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
