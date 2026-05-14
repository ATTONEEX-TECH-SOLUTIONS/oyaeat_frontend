import { ThemeProvider } from '@/components/theme-provider'

export default function PartnerSignupBaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange storageKey="oyaeat-partner-theme">
      {children}
    </ThemeProvider>
  )
}
