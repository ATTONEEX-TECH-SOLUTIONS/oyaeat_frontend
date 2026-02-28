import Link from 'next/link';
import { ArrowRight, BarChart3, UtensilsCrossed, ShoppingCart, Bell, Users, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function RestaurantPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2 text-2xl font-bold text-primary">
            <UtensilsCrossed className="w-8 h-8" />
            oyaeat
          </div>
          <Button asChild>
            <Link href="/restaurant/login">Admin Login</Link>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Grow Your Restaurant with oyaeat
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-balance">
            The all-in-one platform for managing your menu, orders, and customers. 
            Increase sales and streamline operations with our powerful admin dashboard.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" asChild>
              <Link href="/restaurant/login">
                Access Admin Dashboard <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/">
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
            Powerful Admin Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-background rounded-lg p-8 border border-border hover:border-primary transition">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <UtensilsCrossed className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">Menu Management</h3>
              <p className="text-muted-foreground">
                Easily add, edit, and organize menu items with categories, pricing, and descriptions.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-background rounded-lg p-8 border border-border hover:border-primary transition">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <ShoppingCart className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">Order Management</h3>
              <p className="text-muted-foreground">
                Track all orders in real-time, update statuses, and manage fulfillment seamlessly.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-background rounded-lg p-8 border border-border hover:border-primary transition">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">Analytics & Reports</h3>
              <p className="text-muted-foreground">
                Get detailed insights on sales, popular items, and customer preferences.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-background rounded-lg p-8 border border-border hover:border-primary transition">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Bell className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">Notifications</h3>
              <p className="text-muted-foreground">
                Receive instant alerts for new orders and important updates in real-time.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-background rounded-lg p-8 border border-border hover:border-primary transition">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">Staff Management</h3>
              <p className="text-muted-foreground">
                Manage kitchen staff and delivery partners with role-based access control.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-background rounded-lg p-8 border border-border hover:border-primary transition">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Settings className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">Settings & Config</h3>
              <p className="text-muted-foreground">
                Customize your restaurant info, hours, delivery radius, and notification preferences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Credentials */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto bg-primary/10 border border-primary/20 rounded-lg p-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Try Demo Account</h2>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-background rounded-lg p-6 border border-border">
              <p className="text-sm font-semibold text-primary mb-2">EMAIL</p>
              <p className="font-mono text-foreground break-all">admin@pizzapalace.com</p>
            </div>
            <div className="bg-background rounded-lg p-6 border border-border">
              <p className="text-sm font-semibold text-primary mb-2">PASSWORD</p>
              <p className="font-mono text-foreground">password123</p>
            </div>
          </div>
          <div className="text-center">
            <Button size="lg" asChild>
              <Link href="/restaurant/login">
                Login to Admin Dashboard <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 bg-card/30">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 oyaeat. Empowering restaurants worldwide.</p>
        </div>
      </footer>
    </main>
  );
}
