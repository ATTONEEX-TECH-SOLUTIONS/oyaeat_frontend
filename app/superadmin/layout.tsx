import { ThemeProvider } from '@/components/theme-provider'

export default function SuperadminBaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange storageKey="oyaeat-superadmin-theme">
      {children}
    </ThemeProvider>
  )
}
