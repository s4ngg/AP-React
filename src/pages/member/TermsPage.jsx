import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, AlertCircle, X } from "lucide-react";
import { AuthLayout } from "../../components/common/AuthLayout";
import { useSignupStore } from "../../store/signup-store";
import { signup } from "../../api/authApi";
import styles from "./TermsPage.module.css";

const termItems = [
  { id: "termsAgreed", label: "이용약관 동의", required: true, content: `제1조 (목적)\n이 약관은 SHOP(이하 "회사")이 운영하는 쇼핑몰에서 제공하는 서비스를 이용함에 있어 회사와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.\n\n제2조 (정의)\n1. "쇼핑몰"이란 회사가 재화 또는 용역을 이용자에게 제공하기 위하여 컴퓨터 등 정보통신설비를 이용하여 재화 또는 용역을 거래할 수 있도록 설정한 가상의 영업장을 말합니다.\n2. "이용자"란 쇼핑몰에 접속하여 이 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.` },
  { id: "privacyAgreed", label: "개인정보 수집 및 이용 동의", required: true, content: `1. 수집하는 개인정보 항목\n- 필수항목: 이메일, 비밀번호, 이름, 휴대폰 번호, 배송지 주소\n- 선택항목: 관심 카테고리\n\n2. 개인정보의 수집 및 이용목적\n- 회원 가입 및 관리\n- 서비스 제공 및 계약 이행\n\n3. 개인정보의 보유 및 이용기간\n- 회원 탈퇴 시까지` },
  { id: "marketingEmailAgreed", label: "마케팅 이메일 수신 동의", required: false, content: `SHOP에서 제공하는 이벤트, 할인, 신상품 안내 등 마케팅 정보를 이메일로 받아보실 수 있습니다.\n\n본 동의는 선택사항이며, 동의하지 않아도 서비스 이용에 제한이 없습니다.` },
  { id: "marketingSmsAgreed", label: "마케팅 SMS 수신 동의", required: false, content: `SHOP에서 제공하는 이벤트, 할인, 신상품 안내 등 마케팅 정보를 SMS로 받아보실 수 있습니다.\n\n본 동의는 선택사항이며, 동의하지 않아도 서비스 이용에 제한이 없습니다.` },
  { id: "ageVerified", label: "만 14세 이상입니다", required: true, content: `만 14세 미만의 아동은 법정대리인(부모 등)의 동의 없이 회원가입을 할 수 없습니다.\n\n본 항목에 동의하시면 만 14세 이상임을 확인하는 것입니다.` },
];

export default function TermsPage() {
  const navigate = useNavigate();
  const { formData, setFormData, setCurrentStep } = useSignupStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [modalItem, setModalItem] = useState(null);

  useEffect(() => {
    if (!formData.emailVerified) navigate("/signup/verify-email", { replace: true });
  }, [formData.emailVerified, navigate]);

  const handleCheck = (id, checked) => setFormData({ [id]: checked });

  const handleAllCheck = (checked) => {
    setFormData({
      termsAgreed: checked,
      privacyAgreed: checked,
      marketingEmailAgreed: checked,
      marketingSmsAgreed: checked,
      ageVerified: checked,
    });
  };

  const isAllChecked = formData.termsAgreed && formData.privacyAgreed && formData.marketingEmailAgreed && formData.marketingSmsAgreed && formData.ageVerified;
  const isRequiredChecked = formData.termsAgreed && formData.privacyAgreed && formData.ageVerified;

  const handleSubmit = async () => {
    if (!isRequiredChecked) { setError("필수 약관에 모두 동의해주세요"); return; }
    setIsSubmitting(true);
    setError("");
    try {
      await signup({ ...formData });
    } catch {
      // 데모용: 무시
    } finally {
      setCurrentStep(5);
      navigate("/signup/complete");
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout showSteps currentStep={4} title="약관 동의" description="서비스 이용을 위해 약관에 동의해주세요">
      <div className={styles.container}>

        {/* 전체 동의 */}
        <div className={styles.allAgreeBox}>
          <label className={styles.checkLabel}>
            <input type="checkbox" className={styles.checkbox} checked={isAllChecked} onChange={(e) => handleAllCheck(e.target.checked)} />
            <span className={styles.allAgreeText}>전체 동의</span>
          </label>
        </div>

        {/* 개별 약관 */}
        <div className={styles.termsList}>
          {termItems.map((item) => (
            <div key={item.id} className={styles.termItem}>
              <label className={styles.termLabel}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={!!formData[item.id]}
                  onChange={(e) => handleCheck(item.id, e.target.checked)}
                />
                <span>
                  {item.label}
                  {item.required && <span className={styles.required}>(필수)</span>}
                </span>
              </label>
              <button type="button" className={styles.viewBtn} onClick={() => setModalItem(item)}>
                보기 <ChevronRight size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* 에러 */}
        {error && (
          <div className={styles.errorBox}><AlertCircle size={16} /><span>{error}</span></div>
        )}

        {/* 가입 완료 버튼 */}
        <button onClick={handleSubmit} className={styles.submitBtn} disabled={!isRequiredChecked || isSubmitting}>
          {isSubmitting ? <><span className={styles.spinner} /> 가입 중...</> : "가입 완료"}
        </button>

        <button type="button" onClick={() => navigate(-1)} className={styles.backBtn}>
          이전 단계로 돌아가기
        </button>
      </div>

      {/* 약관 보기 모달 */}
      {modalItem && (
        <div className={styles.modalOverlay} onClick={() => setModalItem(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>{modalItem.label}</h3>
              <button className={styles.modalClose} onClick={() => setModalItem(null)}><X size={20} /></button>
            </div>
            <div className={styles.modalBody}>{modalItem.content}</div>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}
