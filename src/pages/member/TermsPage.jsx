import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, AlertCircle, X } from "lucide-react";
import { AuthLayout } from "../../components/common/AuthLayout";
import { useSignupStore } from "../../store/signup-store";
import { signup, getTerms } from "../../api/authApi";
import styles from "./TermsPage.module.css";

export default function TermsPage() {
  const navigate = useNavigate();
  const { formData, setFormData, setCurrentStep } = useSignupStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [modalItem, setModalItem] = useState(null);
  const [termItems, setTermItems] = useState([]);

  useEffect(() => {
    if (!formData.emailVerified) navigate("/signup/verify-email", { replace: true });
  }, [formData.emailVerified, navigate]);

  useEffect(() => {
    setTermItems([
      {
        id: "SERVICE",
        label: "서비스 이용약관",
        required: true,
        content: "제1조 (목적)\n본 약관은 AllPick(이하 '회사')이 제공하는 서비스 이용에 관한 조건 및 절차, 회사와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.\n\n제2조 (정의)\n'서비스'란 회사가 제공하는 전자상거래 관련 제반 서비스를 의미합니다.\n\n제3조 (약관의 효력 및 변경)\n본 약관은 서비스 화면에 게시하거나 기타의 방법으로 공지함으로써 효력이 발생합니다.",
      },
      {
        id: "PRIVACY",
        label: "개인정보 수집 및 이용 동의",
        required: true,
        content: "제1조 (수집하는 개인정보 항목)\n회사는 회원가입, 서비스 이용을 위해 아래의 개인정보를 수집합니다.\n- 필수항목: 이메일, 비밀번호, 이름, 휴대폰 번호\n- 선택항목: 주소\n\n제2조 (개인정보의 수집 및 이용목적)\n회원 관리, 서비스 제공, 구매 및 결제 처리, 고객 상담 응대\n\n제3조 (개인정보의 보유 및 이용기간)\n회원 탈퇴 시까지 보유하며, 관계 법령에 따라 일정 기간 보관될 수 있습니다.",
      },
      {
        id: "MARKETING",
        label: "마케팅 정보 수신 동의",
        required: false,
        content: "제1조 (마케팅 정보 수신)\n회사는 이용자의 동의를 받아 이메일, SMS 등을 통해 신상품, 이벤트, 할인 정보를 발송할 수 있습니다.\n\n제2조 (동의 철회)\n이용자는 언제든지 마케팅 수신 동의를 철회할 수 있으며, 마이페이지에서 설정 변경이 가능합니다.",
      },
    ]);
  }, []);

  const handleCheck = (id, checked) => setFormData({ [id]: checked });

  const handleAllCheck = (checked) => {
    const newData = {};
    termItems.forEach((item) => { newData[item.id] = checked; });
    setFormData(newData);
  };

  const isAllChecked = termItems.length > 0 && termItems.every((item) => !!formData[item.id]);
  const isRequiredChecked = termItems.filter((item) => item.required).every((item) => !!formData[item.id]);

  const handleSubmit = async () => {
    if (!isRequiredChecked) { setError("필수 약관에 모두 동의해주세요"); return; }
    setIsSubmitting(true);
    setError("");
    try {
      // 백엔드 SignupRequestDto: { email, password, name, phone, address }
      // address는 zipCode + address + addressDetail 합쳐서 전송
      const { email, password, name, phone, zipCode, address, addressDetail } = formData;
      const fullAddress = [zipCode, address, addressDetail].filter(Boolean).join(" ");

      await signup({ email, password, name, phone, address: fullAddress });
      setCurrentStep(5);
      navigate("/signup/complete");
    } catch (err) {
      setError(err.response?.data?.message || "회원가입에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout showSteps currentStep={4} title="약관 동의" description="서비스 이용을 위해 약관에 동의해주세요">
      <div className={styles.container}>
        <div className={styles.allAgreeBox}>
          <label className={styles.checkLabel}>
            <input type="checkbox" className={styles.checkbox} checked={isAllChecked} onChange={(e) => handleAllCheck(e.target.checked)} />
            <span className={styles.allAgreeText}>전체 동의</span>
          </label>
        </div>

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

        {error && (
          <div className={styles.errorBox}><AlertCircle size={16} /><span>{error}</span></div>
        )}

        <button onClick={handleSubmit} className={styles.submitBtn} disabled={!isRequiredChecked || isSubmitting}>
          {isSubmitting ? <><span className={styles.spinner} /> 가입 중...</> : "가입 완료"}
        </button>

        <button type="button" onClick={() => navigate(-1)} className={styles.backBtn}>
          이전 단계로 돌아가기
        </button>
      </div>

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
