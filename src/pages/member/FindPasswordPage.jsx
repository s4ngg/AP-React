import { Link } from "react-router-dom";
import { AuthLayout } from "../../components/common/AuthLayout";
import styles from "./FindPages.module.css";

export default function FindPasswordPage() {
  return (
    <AuthLayout title="비밀번호 찾기" description="비밀번호 찾기 서비스를 준비 중입니다">
      <div className={styles.form}>
        <div style={{
          textAlign: "center",
          padding: "40px 20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12
        }}>
          <div style={{ fontSize: 48 }}>🚧</div>
          <p style={{ fontSize: 16, fontWeight: 600, color: "var(--color-text)" }}>
            준비 중인 서비스입니다
          </p>
          <p style={{ fontSize: 14, color: "var(--color-muted)", lineHeight: 1.6 }}>
            비밀번호 찾기 기능은 현재 준비 중입니다.<br />
            빠른 시일 내에 제공될 예정입니다.
          </p>
        </div>

        <div className={styles.links}>
          <Link to="/login" className={styles.link}>로그인</Link>
          <span className={styles.divider}>|</span>
          <Link to="/find-email" className={styles.link}>아이디 찾기</Link>
        </div>
      </div>
    </AuthLayout>
  );
}
