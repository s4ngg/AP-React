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
    getTerms().then((res) => {
      setTermItems(res.data.map((term) => ({
        id: term.termsType,
        label: term.title,
        required: term.required ?? term.isRequired,
        content: term.content,
      })));
    });
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
      const { email, password, name, phone, address } = formData;
      await signup({ email, password, name, phone, address });
      setCurrentStep(5);
      navigate("/signup/complete");
    } catch {
      setError("회원가입에 실패했습니다. 다시 시도해주세요.");
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