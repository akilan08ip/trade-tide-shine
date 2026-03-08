import { useGlobalData } from '@/hooks/useCryptoData';
import { formatMarketCap } from '@/lib/api';
import { Activity, DollarSign, BarChart3, Coins } from 'lucide-react';

const stats = [
  { key: 'mcap', label: 'Market Cap', icon: DollarSign, getValue: (d: any) => formatMarketCap(d.total_market_cap.usd) },
  { key: 'vol', label: '24h Volume', icon: Activity, getValue: (d: any) => formatMarketCap(d.total_volume.usd) },
  { key: 'btc', label: 'BTC Dominance', icon: BarChart3, getValue: (d: any) => `${d.market_cap_percentage.btc?.toFixed(1)}%` },
  { key: 'coins', label: 'Active Coins', icon: Coins, getValue: (d: any) => d.active_cryptocurrencies.toLocaleString() },
];

export default function MarketStats() {
  const { data } = useGlobalData();
  if (!data) return null;

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {stats.map(({ key, label, icon: Icon, getValue }) => (
        <div key={key} className="glass-card rounded-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Icon className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">{label}</span>
          </div>
          <p className="text-lg font-bold font-mono">{getValue(data.data)}</p>
        </div>
      ))}
    </div>
  );
}
