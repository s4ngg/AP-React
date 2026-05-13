import { useEffect } from "react"
import styles from "./ImagePreviewModal.module.css"

export default function ImagePreviewModal({ src, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  if (!src) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <img
        src={src}
        alt="첨부 이미지 확대"
        className={styles.image}
        onClick={(e) => e.stopPropagation()}
      />
      <button className={styles.closeBtn} onClick={onClose} aria-label="닫기">✕</button>
    </div>
  )
}
