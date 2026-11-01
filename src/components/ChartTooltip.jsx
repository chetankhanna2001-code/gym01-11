export default function ChartTooltip({ active, payload, label, unit = '', formatEmpty }) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass !rounded-xl px-3 py-2 text-xs">
      <p className="mb-1 font-display font-semibold">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="flex items-center gap-2 text-muted">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color || p.stroke }} />
          <span className="capitalize">{p.name}</span>
          <span className="ml-auto pl-3 font-semibold text-fg">
            {p.value === 0 && formatEmpty ? formatEmpty : `${p.value}${unit}`}
          </span>
        </p>
      ))}
    </div>
  )
}
