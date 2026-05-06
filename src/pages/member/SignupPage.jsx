import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { AuthLayout } from "../../components/common/AuthLayout";
import { SocialLoginButtons } from "../../components/common/SocialLoginButtons";
import { useSignupStore } from "../../store/signup-store";
import styles from "./SignupPage.module.css";
import { checkEmailDuplicate, validateBusinessNumber } from "../../api/authApi";
// import { sendSmsCode, verifySmsCode } from "../../api/authApi"; // import 추가
 
export default function SignupPage({ isSeller = false }) {
  const navigate = useNavigate();
  const { setFormData, setCurrentStep } = useSignupStore();

  const [businessChecked, setBusinessChecked] = useState(false);
  const [businessValid, setBusinessValid] = useState(false);
  const [checkingBusiness, setCheckingBusiness] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [emailChecked, setEmailChecked] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [phoneVerified, setPhoneVerified] = useState(false);
  // const [phoneSent, setPhoneSent] = useState(false);
  // const [smsCode, setSmsCode] = useState("");
  // const [sendingCode, setSendingCode] = useState(false);
  // const [verifyingCode, setVerifyingCode] = useState(false);
  // const [smsError, setSmsError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setError,
    setValue,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const password = watch("password");
  const passwordConfirm = watch("passwordConfirm");
  const email = watch("email");

  // const handleSendSmsCode = async () => {
  //   const phone = watch("phone");
  //   if (!phone) return;
  //   const cleaned = phone.replace(/-/g, "");
  //   setSendingCode(true);
  //   setSmsError("");
  //   try {
  //     await sendSmsCode(cleaned);
  //     setPhoneSent(true);
  //   } catch {
  //     setSmsError("인증번호 발송에 실패했습니다.");
  //   } finally {
  //     setSendingCode(false);
  //   }
  // };

  // const handleVerifySmsCode = async () => {
  //   const phone = watch("phone");
  //   const cleaned = phone.replace(/-/g, "");
  //   setVerifyingCode(true);
  //   setSmsError("");
  //   try {
  //     await verifySmsCode(cleaned, smsCode);
  //     setPhoneVerified(true);
  //   } catch {
  //     setSmsError("인증번호가 올바르지 않습니다.");
  //   } finally {
  //     setVerifyingCode(false);
  //   }
  // };
  const passwordValidation = {
    hasLength: password?.length >= 8,
    hasLetter: /[a-zA-Z]/.test(password || ""),
    hasUppercase: /[A-Z]/.test(password || ""),
    hasNumber: /[0-9]/.test(password || ""),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password || ""),
  };
  const isPasswordValid =
    passwordValidation.hasLength &&
    passwordValidation.hasLetter &&
    passwordValidation.hasUppercase &&
    passwordValidation.hasNumber &&
    passwordValidation.hasSpecial;

  const passwordsMatch = password && passwordConfirm && password === passwordConfirm;

  const handleCheckEmail = async () => {
    if (!email) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("email", { message: "올바른 이메일 형식이 아닙니다" });
      return;
    }
    setCheckingEmail(true);
    try {
      const response = await checkEmailDuplicate(email);
      setEmailChecked(true);
      setEmailAvailable(response.data?.available ?? true);
    } catch {
      setEmailChecked(true);
      setEmailAvailable(true);
    } finally {
      setCheckingEmail(false);
    }
  }; 

  const handleAddressSearch = () => {
    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.onload = () => {
      new window.daum.Postcode({
        oncomplete: (data) => {
          setValue("zipCode", data.zonecode);
          setValue("address", data.roadAddress || data.jibunAddress);
        },
      }).open();
    };
    document.head.appendChild(script);
  };

  const onSubmit = async (data) => {
    if (!emailChecked || !emailAvailable) {
      setError("email", { message: "이메일 중복 확인을 해주세요" });
      return;
    }
    // if (!phoneVerified) {
    //   setSmsError("휴대폰 인증을 완료해주세요");
    //   return;
    // }
    if (!isPasswordValid) return;
    if (!passwordsMatch) return;

    setIsSubmitting(true);
    try {
      setFormData({
        email: data.email,
        password: data.password,
        name: data.name,
        phone: data.phone.replace(/-/g, ""), // ← 하이픈 제거
        zipCode: data.zipCode,
        address: data.address,
        addressDetail: data.addressDetail,
        isSeller,
        ...(isSeller && {
          sellerData: {
            business_name: data.business_name,
            business_number: data.business_number,
            representative_name: data.representative_name,
            bank_name: data.bank_name,
            bank_account: data.bank_account,
          },
        }),
      });
      setCurrentStep(2);
      navigate("/signup/verify-email");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout showSteps currentStep={1} title="회원가입" description="AllPick 회원이 되어 다양한 혜택을 누리세요">
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={isSeller ? styles.twoColumn : styles.singleColumn}>
          <div className={styles.column}>
            <p className={styles.columnTitle}>기본 정보</p>

            {/* 이메일 */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>이메일</label>
              <div className={styles.emailRow}>
                <input
                  type="email"
                  placeholder="example@email.com"
                  className={`${styles.input} ${styles.emailInput} ${errors.email ? styles.inputError : ""}`}
                  {...register("email", {
                    required: "이메일을 입력해주세요",
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "올바른 이메일 형식이 아닙니다" },
                  })}
                  onChange={() => { setEmailChecked(false); setEmailAvailable(false); }}
                />
                <button type="button" onClick={handleCheckEmail} disabled={checkingEmail || !email} className={styles.checkBtn}>
                  {checkingEmail ? "확인 중..." : "중복 확인"}
                </button>
              </div>
              {errors.email && <p className={styles.fieldError}>{errors.email.message}</p>}
              {emailChecked && (
                <p className={`${styles.emailStatus} ${emailAvailable ? styles.emailAvailable : styles.emailUnavailable}`}>
                  {emailAvailable ? <><Check size={13} /> 사용 가능한 이메일입니다</> : <><X size={13} /> 이미 사용 중인 이메일입니다</>}
                </p>
              )}
            </div>

            {/* 비밀번호 */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>비밀번호</label>
              <div className={styles.inputWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호를 입력해주세요"
                  className={`${styles.input} ${styles.inputWithButton} ${errors.password ? styles.inputError : ""}`}
                  {...register("password", { required: "비밀번호를 입력해주세요" })}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className={styles.eyeButton}>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {password && (
                <div className={styles.passwordValidation}>
                  {[
                    { key: "hasLength", label: "8자 이상" },
                    { key: "hasLetter", label: "영문 포함" },
                    { key: "hasUppercase", label: "대문자 포함" },
                    { key: "hasNumber", label: "숫자 포함" },
                    { key: "hasSpecial", label: "특수문자 포함" },
                  ].map(({ key, label }) => (
                    <span key={key} className={`${styles.validItem} ${passwordValidation[key] ? styles.validItemOk : styles.validItemFail}`}>
                      {passwordValidation[key] ? <Check size={12} /> : <X size={12} />} {label}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* 비밀번호 확인 */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>비밀번호 확인</label>
              <div className={styles.inputWrapper}>
                <input
                  type={showPasswordConfirm ? "text" : "password"}
                  placeholder="비밀번호를 다시 입력해주세요"
                  className={`${styles.input} ${styles.inputWithButton} ${errors.passwordConfirm ? styles.inputError : ""}`}
                  {...register("passwordConfirm", { required: "비밀번호 확인을 입력해주세요" })}
                />
                <button type="button" onClick={() => setShowPasswordConfirm(!showPasswordConfirm)} className={styles.eyeButton}>
                  {showPasswordConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {passwordConfirm && (
                <p className={`${styles.passwordMatch} ${passwordsMatch ? styles.matchOk : styles.matchFail}`}>
                  {passwordsMatch ? <><Check size={14} /> 비밀번호가 일치합니다</> : <><X size={14} /> 비밀번호가 일치하지 않습니다</>}
                </p>
              )}
            </div>

            {/* 이름 */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>이름</label>
              <input
                type="text"
                placeholder="이름을 입력해주세요"
                className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
                {...register("name", {
                  required: "이름을 입력해주세요",
                  pattern: { value: /^[가-힣a-zA-Z]+$/, message: "한글 또는 영문만 입력 가능합니다" },
                })}
              />
              {errors.name && <p className={styles.fieldError}>{errors.name.message}</p>}
            </div>

            {/* 휴대폰 번호 */}
            {/* 휴대폰 번호 */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>휴대폰 번호</label>
              <div className={styles.emailRow}>
                <input
                  type="tel"
                  placeholder="010-0000-0000"
                  className={`${styles.input} ${styles.emailInput} ${errors.phone ? styles.inputError : ""}`}
                  {...register("phone", {
                    required: "휴대폰 번호를 입력해주세요",
                    pattern: { value: /^01[0-9]-[0-9]{3,4}-[0-9]{4}$/, message: "010-0000-0000 형식으로 입력해주세요" },
                  })}
                  // onChange={() => { setPhoneVerified(false); setPhoneSent(false); }}
                />
                {/* <button
                  type="button"
                  onClick={handleSendSmsCode}
                  disabled={sendingCode || phoneVerified}
                  className={styles.checkBtn}
                >
                
                  {sendingCode ? "발송 중..." : phoneSent ? "재발송" : "인증번호 발송"}
                </button> */}
              </div>
              {errors.phone && <p className={styles.fieldError}>{errors.phone.message}</p>}

              {/* 인증번호 입력 */}
              {/*phoneSent && !phoneVerified && (
                <div className={styles.emailRow} style={{ marginTop: 8 }}>
                  <input
                    type="text"
                    placeholder="인증번호 6자리"
                    value={smsCode}
                    onChange={(e) => setSmsCode(e.target.value)}
                    className={`${styles.input} ${styles.emailInput}`}
                    maxLength={6}
                  />
                  <button
                    type="button"
                    onClick={handleVerifySmsCode}
                    disabled={verifyingCode || smsCode.length !== 6}
                    className={styles.checkBtn}
                  >
                    {verifyingCode ? "확인 중..." : "인증 확인"}
                  </button>
                </div>
              )} )*/
              }
            </div>

            {/* 우편번호 */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>우편번호</label>
              <div className={styles.emailRow}>
                <input
                  type="text"
                  placeholder="우편번호"
                  readOnly
                  className={`${styles.input} ${styles.emailInput} ${errors.zipCode ? styles.inputError : ""}`}
                  {...register("zipCode", { required: "우편번호를 입력해주세요" })}
                />
                <button type="button" onClick={handleAddressSearch} className={styles.checkBtn}>
                  주소 검색
                </button>
              </div>
              {errors.zipCode && <p className={styles.fieldError}>{errors.zipCode.message}</p>}
            </div>

            {/* 주소 */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>주소</label>
              <input
                type="text"
                placeholder="주소 검색을 이용해주세요"
                readOnly
                className={`${styles.input} ${errors.address ? styles.inputError : ""}`}
                {...register("address", { required: "주소를 입력해주세요" })}
              />
              {errors.address && <p className={styles.fieldError}>{errors.address.message}</p>}
            </div>
          </div>

          {isSeller && (
            <>
              <div className={styles.columnDivider} />
              <div className={styles.column}>
                <p className={styles.columnTitle}>판매자 정보</p>

                {/* 상호명 */}
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>상호명</label>
                  <input
                    type="text"
                    placeholder="상호명을 입력해주세요"
                    className={`${styles.input} ${errors.business_name ? styles.inputError : ""}`}
                    {...register("business_name", { required: "상호명을 입력해주세요" })}
                  />
                  {errors.business_name && <p className={styles.fieldError}>{errors.business_name.message}</p>}
                </div>

                {/* ✅ 사업자 등록번호 - 버튼 포함 */}
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>사업자 등록번호</label>
                  <div className={styles.emailRow}>
                    <input
                      type="text"
                      placeholder="000-00-00000"
                      className={`${styles.input} ${styles.emailInput} ${errors.business_number ? styles.inputError : ""}`}
                      {...register("business_number", {
                        required: "사업자 등록번호를 입력해주세요",
                        pattern: { value: /^\d{3}-\d{2}-\d{5}$/, message: "000-00-00000 형식으로 입력해주세요" },
                      })}
                      onChange={() => { setBusinessChecked(false); setBusinessValid(false); }}
                    />
                    <button
                      type="button"
                      onClick={handleValidateBusiness}
                      disabled={checkingBusiness || !watch("business_number")}
                      className={styles.checkBtn}
                    >
                      {checkingBusiness ? "확인 중..." : "사업자 확인"}
                    </button>
                  </div>
                  {errors.business_number && <p className={styles.fieldError}>{errors.business_number.message}</p>}
                  {businessChecked && (
                    <p className={`${styles.emailStatus} ${businessValid ? styles.emailAvailable : styles.emailUnavailable}`}>
                      {businessValid
                        ? <><Check size={13} /> 정상 사업자입니다</>
                        : <><X size={13} /> 유효하지 않은 사업자등록번호입니다</>}
                    </p>
                  )}
                </div>

                {/* 대표자명 */}
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>대표자명</label>
                  <input
                    type="text"
                    placeholder="대표자명을 입력해주세요"
                    className={`${styles.input} ${errors.representative_name ? styles.inputError : ""}`}
                    {...register("representative_name", { required: "대표자명을 입력해주세요" })}
                  />
                  {errors.representative_name && <p className={styles.fieldError}>{errors.representative_name.message}</p>}
                </div>

                {/* 은행명 */}
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>은행명</label>
                  <select
                    className={`${styles.input} ${errors.bank_name ? styles.inputError : ""}`}
                    {...register("bank_name", { required: "은행을 선택해주세요" })}
                  >
                    <option value="">은행 선택</option>
                    <option value="국민은행">국민은행</option>
                    <option value="신한은행">신한은행</option>
                    <option value="우리은행">우리은행</option>
                    <option value="하나은행">하나은행</option>
                    <option value="카카오뱅크">카카오뱅크</option>
                    <option value="토스뱅크">토스뱅크</option>
                  </select>
                  {errors.bank_name && <p className={styles.fieldError}>{errors.bank_name.message}</p>}
                </div>

                {/* 계좌번호 */}
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>계좌번호</label>
                  <input
                    type="text"
                    placeholder="계좌번호를 입력해주세요"
                    className={`${styles.input} ${errors.bank_account ? styles.inputError : ""}`}
                    {...register("bank_account", { required: "계좌번호를 입력해주세요" })}
                  />
                  {errors.bank_account && <p className={styles.fieldError}>{errors.bank_account.message}</p>}
                </div>
              </div>
            </>
          )}
        </div>

        <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
          {isSubmitting ? <><span className={styles.spinner} /> 처리 중...</> : "다음 단계"}
        </button>

        <div className={styles.links}>
          <span style={{ fontSize: 14, color: "var(--color-muted)" }}>이미 계정이 있으신가요?</span>
          <Link to="/login" className={styles.link}>로그인</Link>
        </div>

        <SocialLoginButtons />
      </form>
    </AuthLayout>
  );
}