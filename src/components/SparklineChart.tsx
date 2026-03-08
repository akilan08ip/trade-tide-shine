import { useMemo } from 'react';

interface SparklineChartProps {
  data: number[];
  width?: number;
  height?: number;
  positive?: boolean;
}

export default function SparklineChart({ data, width = 120, height = 40, positive = true }: SparklineChartProps) {
  const { pathD, areaD } = useMemo(() => {
    if (!data || data.length === 0) return { pathD: '', areaD: '' };
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const step = width / (data.length - 1);
    
    const points = data.map((v, i) => {
      const x = i * step;
      const y = height - ((v - min) / range) * (height - 4) - 2;
      return { x, y };
    });

    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    const areaD = pathD + ` L${width},${height} L0,${height} Z`;
    
    return { pathD, areaD };
  }, [data, width, height]);

  const gradientId = positive ? 'sparkGreen' : 'sparkRed';
  const color = positive ? 'hsl(142, 71%, 45%)' : 'hsl(0, 72%, 51%)';

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#${gradientId})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
