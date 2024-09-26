import { useCallback, useState } from 'react'

/**
 * A hook that manages the state of a value in the clipboard.
 * 
 * @param {string} defaultVal - The default value to be stored in the clipboard.
 * @returns {{ isCopied: boolean; onCopy: () => void; setValue: (newValue: string) => void; value: string }} - An object containing the state of the clipboard value, a function to copy the value, a function to set a new value, and the current value.
 */
export const useClipboard = (defaultVal: string) => {
  const [value, setValue] = useState(defaultVal)
  const [isCopied, setIsCopied] = useState(false)

  /**
   * Copies the current value to the clipboard and sets a flag indicating the value has been copied.
   * The flag is reset after a short delay.
   */
  const onCopy = useCallback(() => {
    navigator.clipboard.writeText(value)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }, [value])

  return { isCopied, onCopy, setValue, value }
}
