import { useRef, useState } from 'react'
import { t } from '@/i18n/t'
import styles from './CardViewer.module.css'

type ViewerCard = { url: string; alt: string }

type Props = {
  /** At least one card; the first is the thumbnail. `alt` is already resolved. */
  cards: ViewerCard[]
  /** Accessible name of the dialog. */
  label: string
}

/** A thumbnail button that opens the social card(s) in a native modal `<dialog>`. */
export const CardViewer = ({ cards, label }: Props) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const thumbRef = useRef<HTMLButtonElement>(null)
  const [index, setIndex] = useState(0)
  const [open, setOpen] = useState(false)
  const first = cards[0]
  const current = cards[index] ?? first
  if (first === undefined || current === undefined) return null

  const show = (delta: number) => {
    setIndex((i) => (i + delta + cards.length) % cards.length)
  }

  return (
    <>
      <button
        type="button"
        ref={thumbRef}
        className={styles.thumb}
        onClick={() => {
          setIndex(0)
          setOpen(true)
          dialogRef.current?.showModal()
        }}
      >
        <img src={first.url} alt={first.alt} className={styles.thumbImage} loading="lazy" />
      </button>
      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-label={label}
        onKeyDown={(event) => {
          if (event.key !== 'Escape') return
          event.preventDefault()
          dialogRef.current?.close()
        }}
        onClose={() => {
          setOpen(false)
          thumbRef.current?.focus()
        }}
      >
        {open && <img src={current.url} alt={current.alt} className={styles.full} />}
        <div className={styles.controls}>
          {cards.length > 1 && (
            <>
              <button
                type="button"
                className={styles.control}
                onClick={() => {
                  show(-1)
                }}
              >
                {t('content.card.previous')}
              </button>
              <span className={styles.position}>
                {t('content.card.position', { n: index + 1, total: cards.length })}
              </span>
              <button
                type="button"
                className={styles.control}
                onClick={() => {
                  show(1)
                }}
              >
                {t('content.card.next')}
              </button>
            </>
          )}
          <button
            type="button"
            className={styles.control}
            onClick={() => {
              dialogRef.current?.close()
            }}
          >
            {t('content.card.close')}
          </button>
        </div>
      </dialog>
    </>
  )
}
