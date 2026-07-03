type SparklineProps = {
  data: number[];
  width?: number;
  height?: number;
  stroke?: string;
  fill?: string;
};

export function Sparkline({
  data,
  width = 140,
  height = 36,
  stroke = "currentColor",
  fill = "currentColor",
}: SparklineProps) {
  if (data.length < 2) {
    return (
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="block w-full"
        style={{ height: `${height}px` }}
        aria-hidden
      />
    );
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);

  const points = data.map((v, i) => {
    const x = i * step;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return [x, y] as const;
  });

  const path = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");

  const areaPath = `${path} L${width.toFixed(1)},${height} L0,${height} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className="block w-full overflow-visible"
      style={{ height: `${height}px` }}
      aria-hidden
    >
      <path d={areaPath} fill={fill} opacity={0.08} />
      <path d={path} fill="none" stroke={stroke} strokeWidth={1.2} />
    </svg>
  );
}
