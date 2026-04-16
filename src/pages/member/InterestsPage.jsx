import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Shirt, UtensilsCrossed, Wine, Sofa, Check } from "lucide-react";
import { AuthLayout } from "../../components/common/AuthLayout";
import { useSignupStore } from "../../store/signup-store";
import styles from "./InterestsPage.module.css";

const categories = [
  { id: "beauty", name: "뷰티", icon: Sparkles, description: "스킨케어, 메이크업, 향수", style: styles.beauty, activeStyle: styles.beautyActive },
  { id: "fashion", name: "패션", icon: Shirt, description: "의류, 신발, 액세서리", style: styles.fashion, activeStyle: styles.fashionActive },
  { id: "food", name: "식품", icon: UtensilsCrossed, description: "신선식품, 가공식품, 건강식품", style: styles.food, activeStyle: styles.foodActive },
  { id: "liquor", name: "주류", icon: Wine, description: "와인, 위스키, 전통주", style: styles.liquor, activeStyle: styles.liquorActive },
  { id: "living", name: "리빙", icon: Sofa, description: "가구, 생활용품, 인테리어", style: styles.living, activeStyle: styles.livingActive },
];

export default function InterestsPage() {
  const navigate = useNavigate();
  const { formData, setFormData, setCurrentStep } = useSignupStore();

  useEffect(() => {
    if (!formData.emailVerified) navigate("/signup/verify-email", { replace: true });
  }, [formData.emailVerified, navigate]);

  const toggleCategory = (categoryId) => {
    const current = formData.interests || [];
    const updated = current.includes(categoryId)
      ? current.filter((id) => id !== categoryId)
      : [...current, categoryId];
    setFormData({ interests: updated });
  };

  const handleNext = () => {
    setCurrentStep(4);
    navigate("/signup/terms");
  };

  const handleSkip = () => {
    setFormData({ interests: [] });
    setCurrentStep(4);
    navigate("/signup/terms");
  };

  const selectedCount = formData.interests?.length || 0;

  return (
    <AuthLayout showSteps currentStep={3} title="관심 카테고리" description="관심 있는 카테고리를 선택해주세요 (선택사항)">
      <div className={styles.container}>
        <p className={styles.countText}>
          {selectedCount > 0
            ? <><span className={styles.countHighlight}>{selectedCount}개</span> 선택됨</>
            : "선택하지 않고 건너뛸 수 있습니다"}
        </p>

        <div className={styles.grid}>
          {categories.map(({ id, name, icon: Icon, description, style, activeStyle }) => {
            const isSelected = formData.interests?.includes(id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => toggleCategory(id)}
                className={`${styles.categoryBtn} ${isSelected ? activeStyle : style}`}
              >
                {isSelected && (
                  <div className={styles.checkBadge}>
                    <Check size={12} className={styles.checkIcon} />
                  </div>
                )}
                <div className={styles.iconBox}><Icon size={24} /></div>
                <div>
                  <p className={styles.categoryName}>{name}</p>
                  <p className={styles.categoryDesc}>{description}</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className={styles.buttons}>
          <button onClick={handleNext} className={styles.nextBtn}>다음 단계</button>
          <button type="button" onClick={handleSkip} className={styles.skipBtn}>건너뛰기</button>
        </div>

        <button type="button" onClick={() => navigate(-1)} className={styles.backBtn}>
          이전 단계로 돌아가기
        </button>
      </div>
    </AuthLayout>
  );
}
