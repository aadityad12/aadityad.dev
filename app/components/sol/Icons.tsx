export function Arrow({ diagonal = false, className = "" }: { diagonal?: boolean; className?: string }) {
  return <svg className={`arrow ${className}`} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? "M5 19 19 5M5 5h14v14" : "M4 12h15m-6-6 6 6-6 6"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export function Mark({ className = "" }: { className?: string }) {
  return <svg className={className} width="34" height="34" viewBox="0 0 40 40" fill="none" aria-hidden="true"><rect width="40" height="40" rx="2" fill="currentColor" /><path d="m9 28 7-17h3l7 17m-14-6h11M26 11v17h3c7 0 7-17 0-17h-3Z" stroke="var(--paper)" strokeWidth="1.8" strokeLinejoin="round" /></svg>;
}
