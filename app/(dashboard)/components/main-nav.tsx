import Link from 'next/link'

import { cn } from '@/lib/utils'
import { getTranslation } from '@/app/i18n'

export async function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const { t } = await getTranslation('main-nav')

  return (
    <nav
      className={cn('flex items-center space-x-4 lg:space-x-6', className)}
      {...props}
    >
      <Link
        href="/workspace"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        {t('workspace')}
      </Link>
    </nav>
  )
}
