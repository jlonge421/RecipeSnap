"use client";

import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  // This component can be expanded with context providers like React Query, ThemeProvider, etc.
  // For now, it's a simple wrapper.
  return <>{children}</>;
}
