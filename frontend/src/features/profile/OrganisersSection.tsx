import { useRef, useState } from 'react'
import { ButtonLink } from '@/components/content'
import type { Profile } from '@/content/schema'
import { t } from '@/i18n/t'
import { CopyButton } from './CopyButton'
import styles from './OrganisersSection.module.css'

type Language = 'en' | 'it'
type Length = 'short' | 'extended'

/** `Ada Lovelace` -> `ada-lovelace`, for the saved photo's file name. */
const kebab = (name: string): string =>
  name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

type ChoiceProps<V extends string> = {
  legend: string
  name: string
  value: V
  options: readonly { value: V; label: string }[]
  onChange: (value: V) => void
}

const Choice = <V extends string>({ legend, name, value, options, onChange }: ChoiceProps<V>) => (
  <fieldset className={styles.choice}>
    <legend>{legend}</legend>
    <div className={styles.segments}>
      {options.map((option) => (
        <label key={option.value} className={styles.segment}>
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => {
              onChange(option.value)
            }}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  </fieldset>
)

/** "For organisers": the official bio to pick and copy, and the photo to download. */
export const OrganisersSection = ({ profile }: { profile: Profile }) => {
  const [language, setLanguage] = useState<Language>('en')
  const [length, setLength] = useState<Length>('short')
  const [status, setStatus] = useState('')
  const box = useRef<HTMLDivElement>(null)

  const paragraphs = profile.bios[language][length]
  const { photoDownload } = profile
  const fileInfo = t('profile.organisers.fileInfo', {
    format: photoDownload.format,
    width: photoDownload.width,
    height: photoDownload.height,
  })
  const download = t('profile.organisers.download')

  const selectBio = () => {
    if (box.current === null) return
    const range = document.createRange()
    range.selectNodeContents(box.current)
    const selection = window.getSelection()
    selection?.removeAllRanges()
    selection?.addRange(range)
  }

  return (
    <section className={styles.band} aria-labelledby="profile-organisers">
      <div className={styles.main}>
        <h2 id="profile-organisers" className={styles.heading}>
          {t('profile.organisers.title')}
        </h2>
        <p className={styles.intro}>{t('profile.organisers.intro')}</p>
        <div className={styles.choices}>
          <Choice<Language>
            legend={t('profile.organisers.language')}
            name="bio-language"
            value={language}
            options={[
              { value: 'en', label: t('profile.organisers.english') },
              { value: 'it', label: t('profile.organisers.italian') },
            ]}
            onChange={(value) => {
              setLanguage(value)
              setStatus('')
            }}
          />
          <Choice<Length>
            legend={t('profile.organisers.length')}
            name="bio-length"
            value={length}
            options={[
              { value: 'short', label: t('profile.organisers.short') },
              { value: 'extended', label: t('profile.organisers.extended') },
            ]}
            onChange={(value) => {
              setLength(value)
              setStatus('')
            }}
          />
        </div>
        <div
          id="short-bio"
          ref={box}
          className={styles.bio}
          {...(language === 'it' ? { lang: 'it' } : {})}
        >
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className={styles.actions}>
          <CopyButton
            text={paragraphs.join('\n\n')}
            onStart={() => {
              setStatus('')
            }}
            onResult={(copied) => {
              setStatus(t(copied ? 'profile.organisers.copied' : 'profile.organisers.copyFailed'))
              if (!copied) selectBio()
            }}
          />
          <ButtonLink
            variant="secondary"
            href={photoDownload.url}
            download={`${kebab(profile.name)}.jpg`}
          >
            <span className={styles.download}>
              <span>{download}</span>
              <span className={styles.fileInfo}>{fileInfo}</span>
            </span>
          </ButtonLink>
        </div>
        <p role="status" className={styles.status}>
          {status}
        </p>
      </div>
    </section>
  )
}
