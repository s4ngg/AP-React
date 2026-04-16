import { Check } from "lucide-react";
import styles from "./StepIndicator.module.css";

const defaultLabels = ["기본 정보", "이메일 인증", "관심 카테고리", "약관 동의", "가입 완료"];

export function StepIndicator({ currentStep, totalSteps, labels = defaultLabels }) {
  return (
    <div className={styles.container}>
      {/* 모바일 */}
      <div className={styles.mobileStep}>
        <span className={styles.mobileStepCurrent}>{currentStep}</span>
        <span className={styles.mobileStepTotal}>/ {totalSteps}</span>
        <span className={styles.mobileStepLabel}>{labels[currentStep - 1]}</span>
      </div>

      {/* 데스크탑 */}
      <div className={styles.desktopSteps}>
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div key={step} className={styles.stepItem}>
            <div className={styles.stepContent}>
              <div
                className={`${styles.stepCircle} ${
                  step < currentStep
                    ? styles.stepCircleCompleted
                    : step === currentStep
                    ? styles.stepCircleCurrent
                    : styles.stepCirclePending
                }`}
              >
                {step < currentStep ? <Check size={18} /> : step}
              </div>
              <span
                className={`${styles.stepLabel} ${
                  step <= currentStep ? styles.stepLabelActive : styles.stepLabelPending
                }`}
              >
                {labels[step - 1]}
              </span>
            </div>
            {step < totalSteps && (
              <div
                className={`${styles.connector} ${
                  step < currentStep ? styles.connectorCompleted : styles.connectorPending
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
