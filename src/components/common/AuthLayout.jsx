import styles from "./AuthLayout.module.css";
import { StepIndicator } from "./StepIndicator";

export function AuthLayout({
  children,
  showSteps = false,
  currentStep = 1,
  title,
  description,
}) {
  return (
    <div className={styles.wrapper}>
      <main className={styles.main}>
        {showSteps && (
          <div className={styles.steps}>
            <StepIndicator currentStep={currentStep} totalSteps={5} />
          </div>
        )}

        {(title || description) && (
          <div className={styles.titleSection}>
            {title && <h1 className={styles.title}>{title}</h1>}
            {description && <p className={styles.description}>{description}</p>}
          </div>
        )}

        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
}