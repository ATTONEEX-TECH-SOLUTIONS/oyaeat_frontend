import { ThemeProvider } from '@/components/theme-provider'

export default function CustomerBaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange storageKey="oyaeat-customer-theme">
      {children}
    </ThemeProvider>
  )
}
