import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { Phone, Mail } from "lucide-react"
import { getParentCategories } from "../../api/productApi"
import styles from "./Footer.module.css"

const customerLinks = [
  { name: "공지사항", href: "/customer?tab=notice" },
  { name: "자주 묻는 질문", href: "/customer?tab=faq" },
  { name: "1:1 문의", href: "/customer?tab=inquiry" },
  { name: "교환/반품", href: "/customer?tab=return" },
]

export default function Footer() {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    let isMounted = true

    const loadCategories = async () => {
      try {
        const response = await getParentCategories()
        if (!isMounted) return

        setCategories(response.data ?? [])
      } catch {
        if (!isMounted) return

        setCategories([])
      }
    }

    loadCategories()

    return () => {
      isMounted = false
    }
  }, [])

  const categoryNames = categories
    .map((category) => category.categoryName)
    .filter(Boolean)
    .join(", ")
  const description = categoryNames
    ? `${categoryNames}까지 한 곳에서!`
    : "AllPick에서 다양한 상품을 만나보세요!"

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div>
            <Link to="/" className={styles.logo}>AllPick</Link>
            <p className={styles.desc}>{description}</p>
            <div className={styles.contactList}>
              <div className={styles.contactItem}>
                <Phone size={14} />
                <span>고객센터 1588-1234</span>
              </div>
              <div className={styles.contactItem}>
                <Mail size={14} />
                <span>help@allpick.co.kr</span>
              </div>
              <p className={styles.hours}>운영시간: 평일 09:00 - 18:00</p>
            </div>
          </div>

          <div>
            <h3 className={styles.colTitle}>카테고리</h3>
            <ul className={styles.linkList}>
              {categories.map((category) => (
                <li key={category.parentCategoryId}>
                  <Link to={`/products?category=${encodeURIComponent(category.categoryName)}`}>
                    {category.categoryName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={styles.colTitle}>고객센터</h3>
            <ul className={styles.linkList}>
              {customerLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.href}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.copyright}>
          &copy; {new Date().getFullYear()} AllPick. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
