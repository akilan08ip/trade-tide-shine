import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LiveClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const date = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

  return (
    <div className="flex items-center gap-2 text-xs font-mono">
      <Clock className="h-3 w-3 text-primary" />
      <span className="text-muted-foreground hidden md:inline">{date}</span>
      <span className="h-3 w-px bg-border/50 hidden md:inline" />
      <motion.span
        key={now.getSeconds()}
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        className="text-foreground font-semibold tabular-nums"
      >
        {time}
      </motion.span>
    </div>
  );
}
