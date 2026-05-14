import { ThemeProvider } from '@/components/theme-provider'

export default function RestaurantBaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange storageKey="oyaeat-restaurant-theme">
      {children}
    </ThemeProvider>
  )
}
