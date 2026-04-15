import { Link } from "react-router-dom"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import styles from "./HeroBanner.module.css"

const banners = [
  {
    id: 1,
    title: "봄맞이 뷰티 세일",
    subtitle: "최대 50% 할인",
    description: "인기 스킨케어 & 메이크업 브랜드 특가",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&h=500&fit=crop",
    bgColor: "#fdf2f8",
    href: "#",
  },
  {
    id: 2,
    title: "신선식품 직배송",
    subtitle: "산지에서 바로!",
    description: "제철 과일과 채소를 합리적인 가격에",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&h=500&fit=crop",
    bgColor: "#f0fdf4",
    href: "#",
  },
  {
    id: 3,
    title: "리빙 페어",
    subtitle: "집꾸미기 필수템",
    description: "인테리어 소품 & 가구 모음전",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&h=500&fit=crop",
    bgColor: "#fffbeb",
    href: "#",
  },
]

export default function HeroBanner() {
  const [current, setCurrent] = useState(0)
  const banner = banners[current]

  const prev = () => setCurrent((c) => (c - 1 + banners.length) % banners.length)
  const next = () => setCurrent((c) => (c + 1) % banners.length)

  return (
    <section className={styles.section}>
      <div className={styles.bannerWrap} style={{ backgroundColor: banner.bgColor }}>
        <div className={styles.inner}>
          <div className={styles.textArea}>
            <p className={styles.subtitle}>{banner.subtitle}</p>
            <h1 className={styles.title}>{banner.title}</h1>
            <p className={styles.desc}>{banner.description}</p>
            <Link to={banner.href} className={styles.shopBtn}>지금 쇼핑하기</Link>
          </div>
          <div className={styles.imageArea}>
            <div className={styles.imageBox}>
              <img src={banner.image} alt={banner.title} />
            </div>
          </div>
        </div>
      </div>

      <button className={styles.prevBtn} onClick={prev} aria-label="이전">
        <ChevronLeft size={18} />
      </button>
      <button className={styles.nextBtn} onClick={next} aria-label="다음">
        <ChevronRight size={18} />
      </button>

      <div className={styles.dots}>
        {banners.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === current ? styles.dotActive : ""}`}
            onClick={() => setCurrent(i)}
            aria-label={`배너 ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
