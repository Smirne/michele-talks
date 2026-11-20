import { Link } from '@tanstack/react-router'
import { PageHeader } from '@/components/layout'
import { t } from '@/i18n/t'

export const NotFoundPage = () => {
  return (
    <>
      <PageHeader title={t('common.notFound.title')} />
      <p>{t('common.notFound.body')}</p>
      <p>
        <Link to="/">{t('common.notFound.back')}</Link>
      </p>
    </>
  )
}
