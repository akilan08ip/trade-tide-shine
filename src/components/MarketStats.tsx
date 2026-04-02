import { useGlobalData } from '@/hooks/useCryptoData';
import { formatMarketCap } from '@/lib/api';
import { Activity, DollarSign, BarChart3, Coins } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const stats = [
  { key: 'mcap', label: 'Market Cap', icon: DollarSign, color: 'from-primary/20 to-primary/5', iconColor: 'text-primary', glowColor: 'hsl(142,71%,45%)', getValue: (d: any) => formatMarketCap(d.total_market_cap.usd) },
  { key: 'vol', label: '24h Volume', icon: Activity, color: 'from-[hsl(217,91%,60%)]/20 to-[hsl(217,91%,60%)]/5', iconColor: 'text-[hsl(217,91%,60%)]', glowColor: 'hsl(217,91%,60%)', getValue: (d: any) => formatMarketCap(d.total_volume.usd) },
  { key: 'btc', label: 'BTC Dominance', icon: BarChart3, color: 'from-warning/20 to-warning/5', iconColor: 'text-warning', glowColor: 'hsl(38,92%,50%)', getValue: (d: any) => `${d.market_cap_percentage.btc?.toFixed(1)}%` },
  { key: 'coins', label: 'Active Coins', icon: Coins, color: 'from-[hsl(280,65%,60%)]/20 to-[hsl(280,65%,60%)]/5', iconColor: 'text-[hsl(280,65%,60%)]', glowColor: 'hsl(280,65%,60%)', getValue: (d: any) => d.active_cryptocurrencies.toLocaleString() },
];

export default function MarketStats() {
  const { data } = useGlobalData();
  const [tappedCard, setTappedCard] = useState<string | null>(null);

  if (!data) return null;

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {stats.map(({ key, label, icon: Icon, color, iconColor, glowColor, getValue }, i) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: i * 0.1, duration: 0.5, type: 'spring', stiffness: 200 }}
          whileHover={{
            y: -6,
            scale: 1.04,
            boxShadow: `0 8px 30px -8px ${glowColor.replace(')', '/0.3)')}`,
            transition: { duration: 0.25, type: 'spring', stiffness: 300 },
          }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            setTappedCard(key);
            setTimeout(() => setTappedCard(null), 600);
          }}
          className="glass-card rounded-xl p-4 cursor-pointer border-glow group relative overflow-hidden select-none"
        >
          {/* Gradient background shimmer */}
          <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

          {/* Ripple effect on click */}
          {tappedCard === key && (
            <motion.div
              className="absolute inset-0 rounded-xl"
              initial={{ background: `radial-gradient(circle at 50% 50%, ${glowColor.replace(')', '/0.25)')}, transparent 0%)` }}
              animate={{ background: `radial-gradient(circle at 50% 50%, ${glowColor.replace(')', '/0)')}, transparent 100%)` }}
              transition={{ duration: 0.6 }}
            />
          )}

          {/* Animated border glow on hover */}
          <motion.div
            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `linear-gradient(135deg, ${glowColor.replace(')', '/0.15)')}, transparent 50%, ${glowColor.replace(')', '/0.1)')})`,
            }}
          />

          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">{label}</span>
              <motion.div
                whileHover={{ rotate: 20, scale: 1.3 }}
                animate={tappedCard === key ? { rotate: [0, -10, 15, -5, 0], scale: [1, 1.3, 1.1, 1.2, 1] } : {}}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Icon className={`h-4 w-4 ${iconColor} opacity-60 group-hover:opacity-100 transition-all duration-300 group-hover:drop-shadow-[0_0_6px_currentColor]`} />
              </motion.div>
            </div>
            <motion.p
              key={getValue(data.data)}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl font-bold font-mono tracking-tight group-hover:tracking-normal transition-all duration-300"
            >
              {getValue(data.data)}
            </motion.p>

            {/* Subtle animated underline on hover */}
            <motion.div
              className="h-[2px] mt-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: `linear-gradient(90deg, ${glowColor}, transparent)` }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
