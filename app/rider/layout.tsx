import { ThemeProvider } from '@/components/theme-provider'

export default function RiderBaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange storageKey="oyaeat-rider-theme">
      {children}
    </ThemeProvider>
  )
}
