import { useEffect } from "react"
import styles from "./AddressSearch.module.css"

/**
 * 카카오 우편번호 서비스 주소 검색 컴포넌트
 *
 * 사용법:
 * <AddressSearch
 *   onComplete={(data) => {
 *     setZipCode(data.zonecode)
 *     setAddress(data.address)
 *   }}
 * />
 */
export default function AddressSearch({ onComplete }) {
  useEffect(() => {
    // Daum 우편번호 스크립트 동적 로드
    const script = document.createElement("script")
    script.src = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
    script.async = true
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  const handleSearch = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        // 도로명 주소 우선, 없으면 지번 주소
        const address = data.roadAddress || data.jibunAddress
        onComplete({
          zonecode: data.zonecode,   // 우편번호
          address,                   // 기본 주소
        })
      },
    }).open()
  }

  return (
    <button type="button" className={styles.btn} onClick={handleSearch}>
      주소 검색
    </button>
  )
}