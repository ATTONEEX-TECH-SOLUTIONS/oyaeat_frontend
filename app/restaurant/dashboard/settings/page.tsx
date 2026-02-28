'use client';

import React from "react"

import { useState } from 'react';
import { Save, MapPin, Clock, DollarSign, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    restaurantName: 'Pizza Palace',
    email: 'admin@pizzapalace.com',
    phone: '(555) 123-4567',
    address: '123 Main St, Downtown',
    city: 'New York',
    zipCode: '10001',
    country: 'USA',
    openingHour: '10:00',
    closingHour: '23:00',
    deliveryRadius: 5,
    minimumOrder: 15,
    deliveryFee: 2.99,
    notifications: {
      newOrders: true,
      orderUpdates: true,
      systemAlerts: true,
      promotions: false,
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    section?: string
  ) => {
    const { name, value, type } = e.target;

    if (section === 'notifications') {
      setSettings((prev) => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        },
      }));
    } else {
      setSettings((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = () => {
    // Handle save logic
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Restaurant Settings</h1>
        <p className="text-muted-foreground">Manage your restaurant information and preferences.</p>
      </div>

      {/* Restaurant Info */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-6">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <span>🏪</span> Restaurant Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Restaurant Name
            </label>
            <input
              type="text"
              name="restaurantName"
              value={settings.restaurantName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={settings.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={settings.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Country
            </label>
            <input
              type="text"
              name="country"
              value={settings.country}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={settings.address}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              City
            </label>
            <input
              type="text"
              name="city"
              value={settings.city}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Zip Code
            </label>
            <input
              type="text"
              name="zipCode"
              value={settings.zipCode}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Operating Hours */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-6">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Clock className="w-5 h-5" /> Operating Hours
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Opening Hour
            </label>
            <input
              type="time"
              name="openingHour"
              value={settings.openingHour}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Closing Hour
            </label>
            <input
              type="time"
              name="closingHour"
              value={settings.closingHour}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Delivery Settings */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-6">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <MapPin className="w-5 h-5" /> Delivery Settings
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Delivery Radius (km)
            </label>
            <input
              type="number"
              name="deliveryRadius"
              value={settings.deliveryRadius}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Minimum Order ($)
            </label>
            <input
              type="number"
              name="minimumOrder"
              value={settings.minimumOrder}
              step="0.01"
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Delivery Fee ($)
            </label>
            <input
              type="number"
              name="deliveryFee"
              value={settings.deliveryFee}
              step="0.01"
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-6">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Bell className="w-5 h-5" /> Notifications
        </h2>

        <div className="space-y-3">
          {Object.entries(settings.notifications).map(([key, value]) => (
            <div key={key} className="flex items-center gap-3">
              <input
                type="checkbox"
                name={key}
                checked={value}
                onChange={(e) => handleInputChange(e, 'notifications')}
                className="w-4 h-4 rounded border-border"
              />
              <label className="text-sm text-foreground capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-3">
        <Button onClick={handleSave} className="gap-2">
          <Save className="w-5 h-5" />
          Save Changes
        </Button>
        <Button variant="outline">Cancel</Button>
      </div>
    </div>
  );
}
