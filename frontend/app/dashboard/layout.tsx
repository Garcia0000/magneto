// NOTE: In Next.js App Router, layouts do NOT have access to searchParams.
// The auth check is performed in page.tsx via its own searchParams prop.
// This layout is intentionally thin — just a wrapper for the children.

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
