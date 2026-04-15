import { Link } from "react-router-dom"
import { Phone, Mail } from "lucide-react"
import styles from "./Footer.module.css"

const quickLinks = [
  { name: "뷰티", href: "/products?category=beauty" },
  { name: "패션", href: "/products?category=fashion" },
  { name: "식품", href: "/products?category=food" },
  { name: "주류", href: "/products?category=alcohol" },
  { name: "리빙", href: "/products?category=living" },
]

const customerLinks = [
  { name: "자주 묻는 질문", href: "#" },
  { name: "1:1 문의", href: "#" },
  { name: "배송 조회", href: "#" },
  { name: "교환/반품", href: "#" },
]

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div>
            <Link to="/" className={styles.logo}>AllPick</Link>
            <p className={styles.desc}>뷰티, 패션, 식품, 주류, 리빙까지 한 곳에서!</p>
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
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.href}>{link.name}</Link>
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
