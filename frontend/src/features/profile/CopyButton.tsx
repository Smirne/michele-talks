import { buttonClassName } from '@/components/content'
import { t } from '@/i18n/t'

type Props = {
  text: string
  /** Called once the copy attempt has finished. */
  onResult: (copied: boolean) => void
  /** Called as the attempt starts, so the status line can be cleared before it is set again. */
  onStart: () => void
}

/** Copies `text` to the clipboard. The only real `<button>` in the app; reports through callbacks. */
export const CopyButton = ({ text, onResult, onStart }: Props) => (
  <button
    type="button"
    className={buttonClassName('primary')}
    onClick={() => {
      onStart()
      // Absent in insecure contexts and some browsers, whatever the DOM types say.
      const clipboard = navigator.clipboard as Clipboard | undefined
      if (clipboard === undefined) {
        onResult(false)
        return
      }
      clipboard.writeText(text).then(
        () => {
          onResult(true)
        },
        () => {
          onResult(false)
        }
      )
    }}
  >
    {t('profile.organisers.copy')}
  </button>
)
