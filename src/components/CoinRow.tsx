import { Link } from 'react-router-dom';
import { CoinMarket, formatPrice, formatMarketCap, formatPercent } from '@/lib/api';
import SparklineChart from './SparklineChart';
import { motion } from 'framer-motion';

interface CoinRowProps {
  coin: CoinMarket;
  index: number;
}

export default function CoinRow({ coin, index }: CoinRowProps) {
  const change24h = coin.price_change_percentage_24h;
  const isPositive = change24h >= 0;

  return (
    <motion.tr
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02, duration: 0.3 }}
      className="group border-b border-border/30 transition-colors hover:bg-secondary/30"
    >
      <td className="py-3 pl-4 pr-2 text-xs font-mono text-muted-foreground">{coin.market_cap_rank}</td>
      <td className="py-3 pr-4">
        <Link to={`/coin/${coin.id}`} className="flex items-center gap-3">
          <img src={coin.image} alt={coin.name} className="h-7 w-7 rounded-full" loading="lazy" />
          <div>
            <span className="font-semibold text-sm group-hover:text-primary transition-colors">{coin.name}</span>
            <span className="ml-2 text-xs font-mono uppercase text-muted-foreground">{coin.symbol}</span>
          </div>
        </Link>
      </td>
      <td className="py-3 pr-4 text-right font-mono text-sm font-medium">{formatPrice(coin.current_price)}</td>
      <td className={`py-3 pr-4 text-right font-mono text-sm font-semibold ${isPositive ? 'text-gain' : 'text-loss'}`}>
        {formatPercent(change24h)}
      </td>
      <td className={`hidden py-3 pr-4 text-right font-mono text-sm md:table-cell ${(coin.price_change_percentage_7d_in_currency ?? 0) >= 0 ? 'text-gain' : 'text-loss'}`}>
        {formatPercent(coin.price_change_percentage_7d_in_currency)}
      </td>
      <td className="hidden py-3 pr-4 text-right font-mono text-sm lg:table-cell">{formatMarketCap(coin.market_cap)}</td>
      <td className="hidden py-3 pr-4 text-right font-mono text-sm lg:table-cell">{formatMarketCap(coin.total_volume)}</td>
      <td className="hidden py-3 pr-4 xl:table-cell">
        {coin.sparkline_in_7d && (
          <SparklineChart
            data={coin.sparkline_in_7d.price}
            positive={(coin.price_change_percentage_7d_in_currency ?? 0) >= 0}
          />
        )}
      </td>
    </motion.tr>
  );
}
