import { Link } from "react-router-dom"
import { Sparkles, Shirt, Apple, Wine, Home, Cpu, Dumbbell } from "lucide-react"
import { useState, useEffect } from "react"
import styles from "./CategorySection.module.css"
import { getParentCategories } from "../../api/productApi"

const iconMap = {
  "뷰티":    { icon: Sparkles,  iconBg: "#fce7f3", iconColor: "#db2777", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop" },
  "패션":    { icon: Shirt,     iconBg: "#dbeafe", iconColor: "#2563eb", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=300&fit=crop" },
  "식품":    { icon: Apple,     iconBg: "#dcfce7", iconColor: "#16a34a", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=300&fit=crop" },
  "주류":    { icon: Wine,      iconBg: "#ede9fe", iconColor: "#7c3aed", image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=300&h=300&fit=crop" },
  "리빙":    { icon: Home,      iconBg: "#fef3c7", iconColor: "#d97706", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=300&h=300&fit=crop" },
  "전자기기": { icon: Cpu,      iconBg: "#e0f2fe", iconColor: "#0284c7", image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=300&h=300&fit=crop" },
  "스포츠":  { icon: Dumbbell,  iconBg: "#dcfce7", iconColor: "#16a34a", image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=300&h=300&fit=crop" },
}

export default function CategorySection() {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getParentCategories()
        setCategories(res.data || [])
      } catch {
        setCategories([])
      }
    }
    fetchCategories()
  }, [])

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.sectionTitle}>카테고리</h2>
        <div className={styles.grid}>
          {categories.map((c) => {
            const meta = iconMap[c.categoryName] || { icon: Sparkles, iconBg: "#f3f4f6", iconColor: "#6b7280", image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=300&h=300&fit=crop" }
            const Icon = meta.icon
            return (
              <Link key={c.parentCategoryId} to={`/products?category=${c.categoryName}`} className={styles.item}>
                <div className={styles.imageBox}>
                  <img src={meta.image} alt={c.categoryName} />
                  <div className={styles.iconBadge} style={{ backgroundColor: meta.iconBg }}>
                    <Icon size={14} color={meta.iconColor} />
                  </div>
                </div>
                <span className={styles.name}>{c.categoryName}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}