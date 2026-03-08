import { CoinMarket, formatPrice, formatPercent } from '@/lib/api';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface TopMoversProps {
  coins: CoinMarket[];
}

export default function TopMovers({ coins }: TopMoversProps) {
  const sorted = [...coins].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
  const gainers = sorted.slice(0, 5);
  const losers = sorted.slice(-5).reverse();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* Gainers */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="glass-card rounded-xl p-5 relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gain/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-gain/10 transition-colors duration-700" />
        <div className="mb-4 flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gain/15">
            <TrendingUp className="h-3.5 w-3.5 text-gain" />
          </div>
          <h3 className="text-sm font-bold tracking-wide">Top Gainers</h3>
          <span className="text-[10px] font-mono text-muted-foreground bg-secondary/50 rounded-full px-2 py-0.5">24H</span>
        </div>
        <div className="space-y-1">
          {gainers.map((coin, i) => (
            <motion.div
              key={coin.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <Link
                to={`/coin/${coin.id}`}
                className="flex items-center justify-between rounded-lg px-3 py-2.5 transition-all duration-300 hover:bg-gain/5 group/item"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-muted-foreground w-4">{i + 1}</span>
                  <motion.img
                    src={coin.image}
                    alt={coin.name}
                    className="h-6 w-6 rounded-full ring-2 ring-transparent group-hover/item:ring-gain/30 transition-all"
                    whileHover={{ scale: 1.15 }}
                  />
                  <div>
                    <span className="text-sm font-semibold">{coin.symbol.toUpperCase()}</span>
                    <span className="text-xs text-muted-foreground ml-1.5 hidden sm:inline">{coin.name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-muted-foreground">{formatPrice(coin.current_price)}</span>
                  <motion.span
                    className="flex items-center gap-0.5 text-xs font-mono font-bold text-gain bg-gain/10 rounded-md px-2 py-1"
                    whileHover={{ scale: 1.05 }}
                  >
                    <ArrowUpRight className="h-3 w-3" />
                    {formatPercent(coin.price_change_percentage_24h)}
                  </motion.span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Losers */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="glass-card rounded-xl p-5 relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-loss/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-loss/10 transition-colors duration-700" />
        <div className="mb-4 flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-loss/15">
            <TrendingDown className="h-3.5 w-3.5 text-loss" />
          </div>
          <h3 className="text-sm font-bold tracking-wide">Top Losers</h3>
          <span className="text-[10px] font-mono text-muted-foreground bg-secondary/50 rounded-full px-2 py-0.5">24H</span>
        </div>
        <div className="space-y-1">
          {losers.map((coin, i) => (
            <motion.div
              key={coin.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <Link
                to={`/coin/${coin.id}`}
                className="flex items-center justify-between rounded-lg px-3 py-2.5 transition-all duration-300 hover:bg-loss/5 group/item"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-muted-foreground w-4">{i + 1}</span>
                  <motion.img
                    src={coin.image}
                    alt={coin.name}
                    className="h-6 w-6 rounded-full ring-2 ring-transparent group-hover/item:ring-loss/30 transition-all"
                    whileHover={{ scale: 1.15 }}
                  />
                  <div>
                    <span className="text-sm font-semibold">{coin.symbol.toUpperCase()}</span>
                    <span className="text-xs text-muted-foreground ml-1.5 hidden sm:inline">{coin.name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-muted-foreground">{formatPrice(coin.current_price)}</span>
                  <motion.span
                    className="flex items-center gap-0.5 text-xs font-mono font-bold text-loss bg-loss/10 rounded-md px-2 py-1"
                    whileHover={{ scale: 1.05 }}
                  >
                    <ArrowDownRight className="h-3 w-3" />
                    {formatPercent(coin.price_change_percentage_24h)}
                  </motion.span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
