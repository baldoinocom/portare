import Link from 'next/link'

export const EmptyState = ({
  children,
  href,
}: {
  children: React.ReactNode
  href: string
}) => {
  return (
    <Link href={href} className="focus:outline-none">
      <button
        type="button"
        className="relative block w-full rounded-lg border-2 border-dashed border-border p-12 text-center hover:border-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        {children}
      </button>
    </Link>
  )
}
