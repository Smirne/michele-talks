import { config } from '@/config'
import { t } from '@/i18n/t'

export const HomePage = () => {
  return (
    <main>
      <h1>{config.appName}</h1>
      <p>{t('home.scaffold', { url: config.apiBaseUrl })}</p>
    </main>
  )
}
