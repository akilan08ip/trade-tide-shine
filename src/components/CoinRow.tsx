import { Link } from 'react-router-dom';
import { CoinMarket, formatPrice, formatMarketCap, formatPercent } from '@/lib/api';
import SparklineChart from './SparklineChart';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface CoinRowProps {
  coin: CoinMarket;
  index: number;
}

export default function CoinRow({ coin, index }: CoinRowProps) {
  const change24h = coin.price_change_percentage_24h;
  const isPositive = change24h >= 0;
  const change7d = coin.price_change_percentage_7d_in_currency ?? 0;

  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.02, duration: 0.4, type: 'spring', stiffness: 200 }}
      className="group border-b border-border/20 transition-all duration-300 hover:bg-gradient-to-r hover:from-secondary/40 hover:via-secondary/20 hover:to-transparent cursor-pointer"
    >
      <td className="py-3.5 pl-4 pr-2">
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.8 }}
            className="text-muted-foreground/30 hover:text-warning transition-colors"
            onClick={(e) => e.preventDefault()}
          >
            <Star className="h-3.5 w-3.5" />
          </motion.button>
          <span className="text-xs font-mono text-muted-foreground">{coin.market_cap_rank}</span>
        </div>
      </td>
      <td className="py-3.5 pr-4">
        <Link to={`/coin/${coin.id}`} className="flex items-center gap-3">
          <motion.div
            className="relative"
            whileHover={{ scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <img src={coin.image} alt={coin.name} className="h-8 w-8 rounded-full" loading="lazy" />
            <div className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card ${isPositive ? 'bg-gain' : 'bg-loss'}`} />
          </motion.div>
          <div>
            <span className="font-semibold text-sm group-hover:text-primary transition-colors duration-200">{coin.name}</span>
            <div className="text-xs font-mono uppercase text-muted-foreground mt-0.5">{coin.symbol}</div>
          </div>
        </Link>
      </td>
      <td className="py-3.5 pr-4 text-right">
        <motion.span
          key={coin.current_price}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          className="font-mono text-sm font-semibold"
        >
          {formatPrice(coin.current_price)}
        </motion.span>
      </td>
      <td className="py-3.5 pr-4 text-right">
        <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-mono font-bold ${
          isPositive ? 'text-gain bg-gain/10' : 'text-loss bg-loss/10'
        }`}>
          {isPositive ? '▲' : '▼'} {formatPercent(change24h).replace('+', '').replace('-', '')}
        </span>
      </td>
      <td className={`hidden py-3.5 pr-4 text-right md:table-cell`}>
        <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-mono font-bold ${
          change7d >= 0 ? 'text-gain bg-gain/10' : 'text-loss bg-loss/10'
        }`}>
          {change7d >= 0 ? '▲' : '▼'} {formatPercent(change7d).replace('+', '').replace('-', '')}
        </span>
      </td>
      <td className="hidden py-3.5 pr-4 text-right font-mono text-sm lg:table-cell text-muted-foreground">
        {formatMarketCap(coin.market_cap)}
      </td>
      <td className="hidden py-3.5 pr-4 text-right font-mono text-sm lg:table-cell text-muted-foreground">
        {formatMarketCap(coin.total_volume)}
      </td>
      <td className="hidden py-3.5 pr-4 xl:table-cell">
        {coin.sparkline_in_7d && (
          <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
            <SparklineChart
              data={coin.sparkline_in_7d.price}
              positive={change7d >= 0}
            />
          </motion.div>
        )}
      </td>
    </motion.tr>
  );
}
