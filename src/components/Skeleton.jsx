export function Skeleton({ className = '', style }) {
  return <div className={`skeleton rounded-xl ${className}`} style={style} aria-hidden="true" />
}

export function SkeletonCard({ className = '', lines = 3, children }) {
  return (
    <div className={`glass p-5 sm:p-6 ${className}`} aria-busy="true" aria-label="Loading">
      {children ?? (
        <>
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-4 h-8 w-2/3" />
          {Array.from({ length: lines }, (_, i) => (
            <Skeleton key={i} className="mt-3 h-3" style={{ width: `${90 - i * 15}%` }} />
          ))}
        </>
      )}
    </div>
  )
}
