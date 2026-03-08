import { useGlobalData } from '@/hooks/useCryptoData';
import { formatMarketCap } from '@/lib/api';
import { Activity, DollarSign, BarChart3, Coins } from 'lucide-react';
import { motion } from 'framer-motion';

const stats = [
  { key: 'mcap', label: 'Market Cap', icon: DollarSign, color: 'from-primary/20 to-primary/5', iconColor: 'text-primary', getValue: (d: any) => formatMarketCap(d.total_market_cap.usd) },
  { key: 'vol', label: '24h Volume', icon: Activity, color: 'from-[hsl(217,91%,60%)]/20 to-[hsl(217,91%,60%)]/5', iconColor: 'text-[hsl(217,91%,60%)]', getValue: (d: any) => formatMarketCap(d.total_volume.usd) },
  { key: 'btc', label: 'BTC Dominance', icon: BarChart3, color: 'from-warning/20 to-warning/5', iconColor: 'text-warning', getValue: (d: any) => `${d.market_cap_percentage.btc?.toFixed(1)}%` },
  { key: 'coins', label: 'Active Coins', icon: Coins, color: 'from-[hsl(280,65%,60%)]/20 to-[hsl(280,65%,60%)]/5', iconColor: 'text-[hsl(280,65%,60%)]', getValue: (d: any) => d.active_cryptocurrencies.toLocaleString() },
];

export default function MarketStats() {
  const { data } = useGlobalData();
  if (!data) return null;

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {stats.map(({ key, label, icon: Icon, color, iconColor, getValue }, i) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: i * 0.1, duration: 0.5, type: 'spring', stiffness: 200 }}
          whileHover={{ y: -4, scale: 1.02, transition: { duration: 0.2 } }}
          className="glass-card rounded-xl p-4 cursor-default border-glow group relative overflow-hidden"
        >
          {/* Gradient background shimmer */}
          <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">{label}</span>
              <motion.div
                whileHover={{ rotate: 15, scale: 1.2 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Icon className={`h-4 w-4 ${iconColor} opacity-70 group-hover:opacity-100 transition-opacity`} />
              </motion.div>
            </div>
            <motion.p
              key={getValue(data.data)}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl font-bold font-mono tracking-tight"
            >
              {getValue(data.data)}
            </motion.p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
