"use client";

import { DollarSign, Zap, Star, Clock } from 'lucide-react';

interface QuickStatsPanelProps {
  cards: {
    avgOrderValue: number;
    avgDeliveryTimeMins: number;
    customerRating: number;
    avgPrepTimeMins: number;
  };
}

export default function QuickStatsPanel({ cards }: QuickStatsPanelProps) {
  const quickStats = [
    { label: 'Avg. Order Value', value: `₦${Math.round(cards.avgOrderValue).toLocaleString()}`, icon: DollarSign },
    { label: 'Delivery Time',    value: cards.avgDeliveryTimeMins ? `${cards.avgDeliveryTimeMins} min` : '—', icon: Zap },
    { label: 'Customer Rating',  value: cards.customerRating ? `${cards.customerRating}/5.0` : '—', icon: Star },
    { label: 'Prep Time',        value: cards.avgPrepTimeMins ? `${cards.avgPrepTimeMins} min` : '—', icon: Clock },
  ];

  return (
    <div style={{ background: '#fff', border: '1px solid #c8e6c9', borderRadius: 16, padding: 24, boxShadow: '0 1px 4px rgba(26,92,42,0.06)' }}>
      <h3 style={{ color: '#1a5c2a', fontWeight: 700, fontSize: 16, margin: '0 0 20px' }}>Quick Stats</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {quickStats.map(({ label, value, icon: Icon }, i) => (
          <div
            key={label}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 0',
              borderBottom: i < quickStats.length - 1 ? '1px solid #e8f5e9' : 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ background: '#e8f5e9', borderRadius: 8, padding: 7, display: 'flex' }}>
                <Icon size={14} color="#2e7d32" strokeWidth={2.5} />
              </div>
              <span style={{ fontSize: 13, color: '#4a7c59' }}>{label}</span>
            </div>
            <span style={{ fontWeight: 700, fontSize: 14, color: '#1a5c2a' }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
