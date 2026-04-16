import { useRef } from "react";
import styles from "./OtpInput.module.css";

export function OtpInput({ value = "", onChange, maxLength = 6, disabled = false }) {
  const inputs = useRef([]);

  const handleChange = (e, index) => {
    const val = e.target.value.replace(/\D/g, "");
    if (!val) return;

    const newValue = value.split("");
    newValue[index] = val[val.length - 1];
    const joined = newValue.join("").slice(0, maxLength);
    onChange(joined);

    if (index < maxLength - 1 && val) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newValue = value.split("");
      newValue[index] = "";
      onChange(newValue.join(""));
      if (index > 0) {
        inputs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, maxLength);
    onChange(pasted);
    const focusIndex = Math.min(pasted.length, maxLength - 1);
    inputs.current[focusIndex]?.focus();
  };

  return (
    <div className={styles.otpContainer}>
      {Array.from({ length: maxLength }, (_, i) => (
        <input
          key={i}
          ref={(el) => (inputs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={handlePaste}
          disabled={disabled}
          className={styles.otpSlot}
        />
      ))}
    </div>
  );
}
