import type { Credit } from '@/content/schema'
import { t } from '@/i18n/t'

/** "Photo: <by> · <licence>", each part a link when a URL is known. */
export const CreditLine = ({ credit }: { credit: Credit }) => (
  <>
    {t('common.credit.photo')}{' '}
    {credit.url === undefined ? credit.by : <a href={credit.url}>{credit.by}</a>}
    {credit.licence !== undefined && (
      <>
        {t('common.credit.separator')}
        {credit.licenceUrl === undefined ? (
          credit.licence
        ) : (
          <a href={credit.licenceUrl}>{credit.licence}</a>
        )}
      </>
    )}
  </>
)
