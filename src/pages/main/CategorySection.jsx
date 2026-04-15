import { Link } from "react-router-dom"
import { Sparkles, Shirt, Apple, Wine, Home } from "lucide-react"
import styles from "./CategorySection.module.css"

const categories = [
  { name: "뷰티",  icon: Sparkles, count: "1,200+", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop", iconBg: "#fce7f3", iconColor: "#db2777", href: "/products?category=beauty" },
  { name: "패션",  icon: Shirt,    count: "3,500+", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=300&fit=crop", iconBg: "#dbeafe", iconColor: "#2563eb", href: "/products?category=fashion" },
  { name: "식품",  icon: Apple,    count: "2,800+", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=300&fit=crop", iconBg: "#dcfce7", iconColor: "#16a34a", href: "/products?category=food" },
  { name: "주류",  icon: Wine,     count: "800+",   image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=300&h=300&fit=crop", iconBg: "#ede9fe", iconColor: "#7c3aed", href: "/products?category=alcohol" },
  { name: "리빙",  icon: Home,     count: "1,600+", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=300&h=300&fit=crop", iconBg: "#fef3c7", iconColor: "#d97706", href: "/products?category=living" },
]

export default function CategorySection() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.sectionTitle}>카테고리</h2>
        <div className={styles.grid}>
          {categories.map((c) => {
            const Icon = c.icon
            return (
              <Link key={c.name} to={c.href} className={styles.item}>
                <div className={styles.imageBox}>
                  <img src={c.image} alt={c.name} />
                  <div className={styles.iconBadge} style={{ backgroundColor: c.iconBg }}>
                    <Icon size={14} color={c.iconColor} />
                  </div>
                </div>
                <span className={styles.name}>{c.name}</span>
                <span className={styles.count}>{c.count}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
