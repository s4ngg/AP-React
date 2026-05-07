import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CheckCircle, ShoppingBag, Gift, Truck } from "lucide-react";
import { AuthLayout } from "../../components/common/AuthLayout";
import { useSignupStore } from "../../store/signup-store";
import styles from "./SignupCompletePage.module.css";

export default function SignupCompletePage() {
  const navigate = useNavigate();
  const { formData, resetForm } = useSignupStore();

  useEffect(() => {
    if (!formData.email || !formData.name) navigate("/signup", { replace: true });
  }, [formData.email, formData.name, navigate]);

  const handleGoToLogin = () => {
    navigate("/login");
    resetForm();
  };

  return (
    <AuthLayout showSteps currentStep={6}>
      <div className={styles.container}>
        <div className={styles.iconCircle}>
          <CheckCircle size={48} color="#16a34a" />
        </div>

        <div className={styles.titleSection}>
          <h1 className={styles.title}>가입을 축하합니다!</h1>
          <p className={styles.name}>
            <span className={styles.nameHighlight}>{formData.name}</span>님, SHOP의 회원이 되셨습니다
          </p>
          <p className={styles.email}>{formData.email}</p>
        </div>

        <div className={styles.benefitCard}>
          <p className={styles.benefitTitle}>회원 혜택 안내</p>
          <div className={styles.benefitGrid}>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}><Gift size={24} /></div>
              <p className={styles.benefitLabel}>신규 가입 쿠폰</p>
              <p className={styles.benefitValue}>3,000원</p>
            </div>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}><ShoppingBag size={24} /></div>
              <p className={styles.benefitLabel}>적립금 혜택</p>
              <p className={styles.benefitValue}>최대 5%</p>
            </div>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}><Truck size={24} /></div>
              <p className={styles.benefitLabel}>무료배송</p>
              <p className={styles.benefitValue}>5만원 이상</p>
            </div>
          </div>
        </div>

        <div className={styles.buttons}>
          <button onClick={handleGoToLogin} className={styles.primaryBtn}>
            로그인 하러 가기
          </button>
          <Link to="/" className={styles.outlineBtn}>
            메인으로 가기
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
